import crypto from "crypto";

import { z } from "zod";

import { OAuthProvider } from "@/drizzle/schemas/enums";
import { baseUrl } from "@/lib/utils";

import { createGithubOAuthClient, GitHubEmail } from "./github";
import { createGoogleOAuthClient } from "./google";

type OAuthUrls = {
  auth: string;
  token: string;
  user: string;
};

type UserInfo<T> = {
  schema: z.ZodSchema<T>;
  parser: (data: T) => { id: string; email: string; name: string };
};

type OAuthClientConfig<T> = {
  provider: OAuthProvider;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  urls: OAuthUrls;
  userInfo: UserInfo<T>;
};

function base64URLEncode(buffer: Buffer): string {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32));
}

function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return base64URLEncode(hash);
}

interface JwtHeader {
  alg: string;
  kid: string; // Key ID
  typ?: string;
}

// Contains standard claims (iss, sub, aud, exp, iat, nonce)
// and potentially provider-specific claims like email, name, etc.
interface JwtPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nonce?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  [key: string]: unknown;
}


function decodeJwt(token: string): { header: JwtHeader; payload: JwtPayload; signature: string; encodedHeaderAndPayload: string } | null {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }
    const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString());
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
    return { header, payload, signature, encodedHeaderAndPayload: `${encodedHeader}.${encodedPayload}` };
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

// --- Google JWKS Fetching & Caching ---

interface Jwk {
  kty: string;
  use?: string;
  kid?: string;
  alg?: string;
  n?: string; // Modulus
  e?: string; // Exponent
  [key: string]: unknown;
}

interface Jwks {
  keys: Jwk[];
}

interface CachedJwks {
  jwks: Jwks;
  expiresAt: number; // ms
}

let googleJwksCache: CachedJwks | null = null;

let googleJwksUri: string | null = null;

const GOOGLE_OIDC_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration";
const DEFAULT_JWKS_CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours fallback

/**
 * @param headerValue The string value of the Cache-Control header.
 * @returns Max age in ms
 */
function getMaxAgeFromCacheControl(headerValue: string | null): number | null {
  if (!headerValue) return null;
  const maxAgeMatch = headerValue.match(/max-age=(\\d+)/);
  if (maxAgeMatch && maxAgeMatch[1]) {
    return parseInt(maxAgeMatch[1], 10) * 1000;
  }
  return null;
}

async function fetchAndCacheGoogleJwks(): Promise<Jwks | null> {
  try {
    if (!googleJwksUri) {
      const discoveryResponse = await fetch(GOOGLE_OIDC_DISCOVERY_URL);
      if (!discoveryResponse.ok) {
        console.error(`[JWKS] Failed to fetch Google OIDC discovery document: ${discoveryResponse.status}`);
        return null;
      }
      const discoveryData = await discoveryResponse.json();
      if (!discoveryData.jwks_uri || typeof discoveryData.jwks_uri !== 'string') {
        console.error("[JWKS] jwks_uri not found or invalid in Google OIDC discovery document.");
        return null;
      }
      googleJwksUri = discoveryData.jwks_uri;
    }

    if (!googleJwksUri) {
        console.error("[JWKS] Cannot fetch JWKS because jwks_uri is null.");
        return null;
    }

    const jwksResponse = await fetch(googleJwksUri);
    if (!jwksResponse.ok) {
      console.error(`[JWKS] Failed to fetch Google JWKS from ${googleJwksUri}: ${jwksResponse.status}`);
      return null;
    }

    const jwksData: Jwks = await jwksResponse.json();
    const cacheControl = jwksResponse.headers.get("Cache-Control");
    const expiresIn = getMaxAgeFromCacheControl(cacheControl);
    
    const expiresAt = Date.now() + (expiresIn || DEFAULT_JWKS_CACHE_DURATION_MS);

    googleJwksCache = { jwks: jwksData, expiresAt };
    console.log(`[JWKS] Google JWKS fetched and cached. Expires at: ${new Date(expiresAt).toISOString()}`);
    return jwksData;

  } catch (error) {
    console.error("[JWKS] Error fetching or caching Google JWKS:", error);
    return googleJwksCache ? googleJwksCache.jwks : null;
  }
}

/**
 * Finds the public key for the given Key ID (kid).
 * @param kid The Key ID from the ID Token header.
 * @returns A Promise resolving to a crypto.KeyObject or null if not found/error.
 */
async function getGooglePublicKey(kid: string): Promise<crypto.KeyObject | null> {
  let currentJwks: Jwks | null = null;

  if (googleJwksCache && Date.now() < googleJwksCache.expiresAt) {
    console.log("[JWKS] Using cached Google JWKS.");
    currentJwks = googleJwksCache.jwks;
  } else {
    console.log("[JWKS] Cache miss or expired. Fetching Google JWKS...");
    currentJwks = await fetchAndCacheGoogleJwks();
  }

  if (!currentJwks || !currentJwks.keys) {
    console.error("[getGooglePublicKey] No JWKS available to find key for KID:", kid);
    return null;
  }
  
  const key = currentJwks.keys.find(k => k.kid === kid);

  if (!key) {
    console.error(`[getGooglePublicKey] Key not found for KID: ${kid} in the fetched/cached JWKS.`);
    return null;
  }

  if (key.kty !== 'RSA' ) {
    console.error(`[getGooglePublicKey] Key with KID: ${kid} is not an RSA key (kty: ${key.kty}).`);
    return null;
  }

  try {
    const jwkForCrypto = {
        kty: key.kty,
        n: key.n,
        e: key.e,
    };
    return crypto.createPublicKey({ key: jwkForCrypto, format: 'jwk' });
  } catch (error) {
    console.error(`[getGooglePublicKey] Error creating public key for KID: ${kid}:`, error);
    return null;
  }
}

export class OAuthClient<T> {
  private readonly provider: OAuthProvider;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly scopes: string[];
  private readonly urls: OAuthUrls;
  private readonly userInfo: UserInfo<T>;
  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
    expires_in: z.number().optional(), // Often present
    refresh_token: z.string().optional(), // If offline access requested
    scope: z.string().optional(), // Actual scopes granted
    id_token: z.string().optional(), // For OIDC
  });
  private readonly userDataSchema: z.ZodSchema<T>;

  constructor(config: OAuthClientConfig<T>) {
    this.provider = config.provider;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.scopes = config.scopes;
    this.urls = config.urls;
    this.userInfo = config.userInfo;
    this.userDataSchema = config.userInfo.schema;
  }

  private get redirectUrl() {
    
    return new URL(`/api/oauth/${this.provider}`, baseUrl);
  }

  /* Step 1: */
  createAuthUrl(options?: { nonce?: string }) {
    const state = crypto.randomBytes(32).toString("hex");
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    const url = new URL(this.urls.auth);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("redirect_uri", this.redirectUrl.toString());
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", this.scopes.join(" "));
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");

    // Add nonce for OIDC providers like Google, if provided
    if (options?.nonce && this.provider === "google") {
      url.searchParams.set("nonce", options.nonce);
    }

    return { authUrl: url.toString(), state, codeVerifier };
  }
  
  /* Step 2: */
  private async fetchToken(code: string, codeVerifier: string, nonceFromCookie?: string) {
    const body = new URLSearchParams({
      code,
      redirect_uri: this.redirectUrl.toString(),
      grant_type: "authorization_code",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code_verifier: codeVerifier,
    });
  
    if (this.provider === "google") {
      body.set("access_type", "offline");
      body.set("approval_prompt", "force");
    }
  
    const res = await fetch(this.urls.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body,
    });
  
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Token fetch failed: ${res.status} ${res.statusText} - ${errorBody}`);
    }
  
    const rawData = await res.json();
    const parsedToken = this.tokenSchema.safeParse(rawData);
  
    if (!parsedToken.success) {
      throw new InvalidTokenError(parsedToken.error);
    }
  
    const tokenType = parsedToken.data.token_type || 'Bearer';
    let validatedIdTokenClaims: JwtPayload | undefined;
  
    const idToken = parsedToken.data.id_token;
  
    if (idToken && this.provider === 'google') {
      const decoded = decodeJwt(idToken);
      if (!decoded) throw new Error("Invalid ID Token.");
  
      const { header, payload, signature, encodedHeaderAndPayload } = decoded;
      const publicKey = await getGooglePublicKey(header.kid);
  
      if (!publicKey) {
        console.error(`No public key for KID: ${header.kid}`);
        throw new Error("Signature verification failed.");
      }
  
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(encodedHeaderAndPayload);
      const isSignatureValid = verifier.verify(publicKey, signature, 'base64url');
  
      if (!isSignatureValid) {
        console.error("Invalid signature.");
        throw new Error("Signature invalid.");
      }
  
      const now = Math.floor(Date.now() / 1000);
  
      if (!['https://accounts.google.com', 'accounts.google.com'].includes(payload.iss)) {
        throw new Error(`Invalid issuer: ${payload.iss}`);
      }
  
      if (payload.aud !== this.clientId) {
        throw new Error(`Invalid audience: ${payload.aud}`);
      }
  
      if (payload.exp <= now) {
        throw new Error(`Token expired: ${new Date(payload.exp * 1000)}`);
      }
  
      if (payload.iat > now + 300) {
        throw new Error(`'iat' in future: ${new Date(payload.iat * 1000)}`);
      }
  
      if (!nonceFromCookie) {
        throw new Error("Missing nonce.");
      }
  
      if (payload.nonce !== nonceFromCookie) {
        throw new Error("Nonce mismatch.");
      }
  
      validatedIdTokenClaims = payload;
  
    } else if (idToken && this.provider !== 'google') {
      console.warn(`Received ID Token for '${this.provider}', but no validation implemented.`);
    }
  
    return {
      accessToken: parsedToken.data.access_token,
      tokenType,
      _idToken: idToken,
      idTokenClaims: validatedIdTokenClaims,
    };
  }
  

  /* Step 3: */
  async fetchUser(code: string, codeVerifier: string, nonceFromCookie?: string) {
    const { accessToken, tokenType, /* _idToken, */ idTokenClaims } = await this.fetchToken(code, codeVerifier, nonceFromCookie);

    if (idTokenClaims && this.provider === 'google') {
      console.log("[fetchUser] Using validated ID Token claims for Google user.");
      const userFromIdToken = {
        id: idTokenClaims.sub,
        email: idTokenClaims.email,
        name: idTokenClaims.name || `${idTokenClaims.given_name || ''} ${idTokenClaims.family_name || ''}`.trim() || idTokenClaims.email,
        picture: idTokenClaims.picture,
      };
      
      const parsedDataFromIdToken = this.userDataSchema.safeParse(userFromIdToken);

      if (parsedDataFromIdToken.success) {
        return this.userInfo.parser(parsedDataFromIdToken.data);
      } else {
        console.warn("[fetchUser] Failed to parse user data constructed from ID Token claims for Google. Falling back to /userinfo.", parsedDataFromIdToken.error);
      }
    }
    console.log(`[fetchUser] Provider ${this.provider}: fetching from userinfo endpoint.`);
    const userResponse = await fetch(this.urls.user, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        Accept: 'application/json'
      },
    });
    
    
    if (!userResponse.ok) {
      const errorBody = await userResponse.text();
      throw new Error(`Failed to fetch user info: ${userResponse.status} ${userResponse.statusText} - ${errorBody}`);
    }

    const rawData = await userResponse.json() as z.infer<typeof this.userInfo.schema>;

    if (this.provider === 'github') {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
          Accept: 'application/json',
        },
      });
  
      if (emailResponse.ok) {
        const emails: GitHubEmail[] = await emailResponse.json();
        ;(rawData as { email: string | null }).email = (emails.find((e) => e.primary) ?? emails[0]).email;
      }
    }
    const parsedData = this.userDataSchema.safeParse(rawData);

    if (!parsedData.success) {
      throw new InvalidUserError(parsedData.error);
    }

    return this.userInfo.parser(parsedData.data);
  }
}

export function getOAuthClient(provider: OAuthProvider) {
  switch (provider) {
    case "google":
      return createGoogleOAuthClient();
    case "github":
      return createGithubOAuthClient();
    default:
      throw new Error(`Invalid provider: ${provider}`);
  }
}

class InvalidTokenError extends Error {
  public cause: z.ZodError;
  constructor(zodError: z.ZodError) {
    super(`Invalid Token response structure: ${zodError.message}`);
    this.name = 'InvalidTokenError';
    this.cause = zodError;
  }
}

class InvalidUserError extends Error {
  public cause: z.ZodError;
  constructor(zodError: z.ZodError) {
    super(`Invalid User response structure: ${zodError.message}`);
    this.name = 'InvalidUserError';
    this.cause = zodError;
  }
}