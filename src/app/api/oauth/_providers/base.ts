import crypto from "crypto";

import { z } from "zod";

import { OAuthProvider } from "@/drizzle/schemas/enums";
import { baseUrl } from "@/lib/utils";

import { createGithubOAuthClient, GitHubEmail } from "./github";
import { createGoogleOAuthClient } from "./google";
// Type definitions
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

// Helper function to Base64URL encode a buffer
function base64URLEncode(buffer: Buffer): string {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Helper function to generate a code verifier for PKCE
function generateCodeVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32));
}

// Helper function to generate a code challenge for PKCE
function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return base64URLEncode(hash);
}

// --- JWT Types and Validation Helpers ---
interface JwtHeader {
  alg: string; // Algorithm, e.g., "RS256"
  kid: string; // Key ID
  typ?: string; // Type, e.g., "JWT"
}

interface JwtPayload {
  iss: string;       // Issuer
  sub: string;       // Subject (user ID)
  aud: string;       // Audience (your client ID)
  exp: number;       // Expiration time (seconds since epoch)
  iat: number;       // Issued at time (seconds since epoch)
  nonce?: string;     // Nonce (must match nonce sent in auth request)
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  [key: string]: unknown; // Use unknown for stricter typing of arbitrary claims
}

/**
 * Decodes a JWT string into its header, payload, and signature parts.
 * Does not verify the signature.
 */
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

/**
 * !!! SIMULATED FUNCTION - NEEDS PRODUCTION-READY IMPLEMENTATION FOR JWKS FETCHING & CACHING !!!
 * Fetches Google's OIDC discovery document, then JWKS, and finds the public key for the given Key ID (kid).
 * This function simulates fetching by using a hardcoded JWKS for demonstration.
 * In a real scenario, it MUST fetch from Google's `jwks_uri`, cache keys respecting HTTP cache headers,
 * and handle key rotation.
 * @param kid The Key ID from the ID Token header.
 * @returns A Promise resolving to a crypto.KeyObject or null if not found/error.
 */
async function getGooglePublicKey(kid: string): Promise<crypto.KeyObject | null> {
  // Directly using the JWKS content you provided.
  // In production: fetch this from the `jwks_uri` found in Google's OIDC discovery document.
  // `jwks_uri` is "https://www.googleapis.com/oauth2/v3/certs"
  const googleJwks = {
    "keys": [
      {
        "kty": "RSA",
        "use": "sig",
        "e": "AQAB",
        "n": "03Cww27F2O7JxB5Ji9iT9szfKZ4MK-iPzVpQkdLjCuGKfpjaCVAz9zIQ0-7gbZ-8cJRaSLfByWTGMIHRYiX2efdjz1Z9jck0DK9W3mapFrBPvM7AlRni4lPlwUigDd8zxAMDCheqyK3vCOLFW-1xYHt_YGwv8b0dP7rjujarEYlWjeppO_QMNtXdKdT9eZtBEcj_9ms9W0aLdCFNR5AAR3y0kLkKR1H4DW7vncB46rqCJLenhlCbcW0MZ3asqcjqBQ2t9QMRnY83Zf_pNEsCcXlKp4uOQqEvzjAc9ZSr2sOmd_ESZ_3jMlNkCZ4J41TuG-My5illFcW5LajSKvxD3w",
        "alg": "RS256",
        "kid": "07b80a365428525f8bf7cd0846d74a8ee4ef3625"
      },
      {
        "kty": "RSA",
        "use": "sig",
        "e": "AQAB",
        "n": "u4iUh27zU1-gEDT4Mh3dvAIi-F8GVi70EogmEpAIbTcVzPbK6vty_bpGsj5j2A8FzBDCIvhyRTdULAPEUHt3W1BraI23c1YUOjWD8rKqvy4Uf2mAuvdHTRE9OZPpRD2lLnBWylj2rVKhdl1IZi_CzvOyL6G6UhwYTlVeWR2houA1o8o3WUBC26SkXpH6mQrueCAPqfyJRumZToiIqnpGb0mfdHPRVE0IT_0OLZjpG-lLldFu4sUPbEgp-hr6kVXYY2-Mh_LuRwFcdhBArjo6X5P3jlIbyOuabuj79nNsIJ-qZEwRqn5lL_wddZ8-3-3sfGgu5t8i-YECOcECPLhbzw",
        "alg": "RS256",
        "kid": "e14c37d6e5c756e8b72fdb5004c0cc356337924e"
      }
    ]
  };

  // --- PRODUCTION NOTES for fetching and caching JWKS: ---
  // 1. Fetch Google OIDC discovery: https://accounts.google.com/.well-known/openid-configuration (as you did)
  // 2. Get `jwks_uri` (which is https://www.googleapis.com/oauth2/v3/certs).
  // 3. Fetch the JWKS from this `jwks_uri`.
  // 4. Implement a cache for these keys. The HTTP response from Google for the JWKS URI will contain
  //    Cache-Control or Expires headers. Respect these to know how long to cache the keys.
  //    Keys should be refreshed before they expire from your cache, or on-demand if a new `kid` is seen.
  // 5. Handle potential errors during fetching (network issues, Google service unavailable).
  // --- 

  const key = googleJwks.keys.find(k => k.kid === kid);

  if (!key) {
    console.error(`[getGooglePublicKey] Key not found for KID: ${kid} in the (simulated) JWKS.`);
    return null;
  }

  if (key.kty !== 'RSA' || key.alg !== 'RS256') {
    console.error(`[getGooglePublicKey] Key with KID: ${kid} is not an RSA RS256 key.`);
    return null;
  }

  try {
    // Construct the JWK object for crypto.createPublicKey
    // We only need kty, n, and e for an RSA public key from JWK format.
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

// --- End JWT Validation Helpers ---

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

    // Remove Google-specific parameters if they are not needed universally
    // or handle them per provider
    if (this.provider === "google") {
      body.set("access_type", "offline"); // Example: Keep for Google if needed
      body.set("approval_prompt", "force"); // Example: Keep for Google if needed
    }

    const res = await fetch(this.urls.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body,
    });
    if (!res.ok) {
      // Provide more context on token fetch errors
      const errorBody = await res.text();
      throw new Error(`Failed to fetch token: ${res.status} ${res.statusText} - ${errorBody}`);
    }
    const rawData = await res.json();

    const parsedToken = this.tokenSchema.safeParse(rawData);
    if (!parsedToken.success) {
      throw new InvalidTokenError(parsedToken.error);
    }
    const tokenType = parsedToken.data.token_type || 'Bearer';
    
    let validatedIdTokenClaims: JwtPayload | undefined = undefined;
    if (parsedToken.data.id_token && this.provider === 'google') { // Process only for Google for now
      const decoded = decodeJwt(parsedToken.data.id_token);
      if (!decoded) {
        throw new Error("Failed to decode ID Token.");
      }
      const { header, payload, signature, encodedHeaderAndPayload } = decoded;

      // 1. Fetch Public Key (CRITICAL: Implement getGooglePublicKey robustly)
      const publicKey = await getGooglePublicKey(header.kid);
      if (!publicKey) {
        console.error(`[ID Token Validation] Public key not found for KID: ${header.kid}. Cannot verify signature.`);
        throw new Error("ID Token signature verification failed: Public key unavailable.");
      }

      // 2. Verify Signature (CRITICAL)
      const verifier = crypto.createVerify('RSA-SHA256'); // Google uses RS256 for ID tokens
      verifier.update(encodedHeaderAndPayload);
      const isSignatureValid = verifier.verify(publicKey, signature, 'base64url');

      if (!isSignatureValid) {
        console.error("[ID Token Validation] Signature verification failed.");
        throw new Error("ID Token signature invalid.");
      }
      console.log("[ID Token Validation] Signature verified successfully.");

      // 3. Validate Claims
      const nowInSeconds = Math.floor(Date.now() / 1000);

      // ISS (Issuer)
      if (payload.iss !== 'https://accounts.google.com' && payload.iss !== 'accounts.google.com') {
        throw new Error(`ID Token validation failed: Invalid issuer '${payload.iss}'.`);
      }

      // AUD (Audience)
      if (payload.aud !== this.clientId) {
        throw new Error(`ID Token validation failed: Invalid audience '${payload.aud}'. Expected '${this.clientId}'.`);
      }

      // EXP (Expiration Time)
      if (payload.exp <= nowInSeconds) {
        throw new Error(`ID Token validation failed: Token expired at ${new Date(payload.exp * 1000)}.`);
      }

      // IAT (Issued At) - Optional: check if issued too far in the past (e.g., >1hr)
      if (payload.iat > nowInSeconds + 300) { // Allow 5 mins clock skew for iat in future
          throw new Error(`ID Token validation failed: Issued at time '${new Date(payload.iat * 1000)}' is in the future.`);
      }

      // NONCE
      if (!nonceFromCookie) {
        throw new Error("ID Token validation failed: Nonce from cookie is missing for Google OIDC flow.");
      }
      if (payload.nonce !== nonceFromCookie) {
        throw new Error("ID Token validation failed: Nonce mismatch. Potential replay attack.");
      }
      console.log("[ID Token Validation] All claims validated successfully.");

      validatedIdTokenClaims = payload; // ID Token is validated

    } else if (parsedToken.data.id_token && this.provider !== 'google') {
      // For other potential OIDC providers, similar validation would be needed.
      console.warn(`ID Token received for non-Google provider '${this.provider}', but validation is not implemented for it.`);
    }

    return {
      accessToken: parsedToken.data.access_token,
      tokenType: tokenType,
      _idToken: parsedToken.data.id_token, // Renamed to satisfy linter, raw token still available
      idTokenClaims: validatedIdTokenClaims, 
    };
  }

  /* Step 3: */
  async fetchUser(code: string, codeVerifier: string, nonceFromCookie?: string) {
    // _idToken is available here if needed, but idTokenClaims is primary for user info
    const { accessToken, tokenType, /* _idToken, */ idTokenClaims } = await this.fetchToken(code, codeVerifier, nonceFromCookie);

    // For OIDC providers like Google, if ID token claims are validated and sufficient,
    // use them directly to construct the user object. This is preferred.
    if (idTokenClaims && this.provider === 'google') {
      console.log("[fetchUser] Using validated ID Token claims for Google user.");
      // Map OpenID Connect standard claims to your internal user structure.
      // Common OIDC claims: sub (subject/ID), email, email_verified, name, picture, given_name, family_name.
      // Ensure your googleUserSchema and parser in google.ts can handle these or adapt.
      
      // Construct an object that matches the expected input for your userInfo.parser
      // based on standard OIDC claims available in idTokenClaims.
      const userFromIdToken = {
        id: idTokenClaims.sub, // Standard OIDC subject claim for user ID
        email: idTokenClaims.email,
        name: idTokenClaims.name || `${idTokenClaims.given_name || ''} ${idTokenClaims.family_name || ''}`.trim() || idTokenClaims.email,
        picture: idTokenClaims.picture,
        // email_verified: idTokenClaims.email_verified, // Important: You should capture and use this!
        // Potentially add other fields if your googleUserSchema expects them from idTokenClaims
      };
      
      // Validate this constructed object against your schema before parsing
      // This ensures the claims map correctly to what your parser expects.
      const parsedDataFromIdToken = this.userDataSchema.safeParse(userFromIdToken);

      if (parsedDataFromIdToken.success) {
         // Potentially pass idTokenClaims.email_verified to connectUserToAccount
        return this.userInfo.parser(parsedDataFromIdToken.data);
      } else {
        console.warn("[fetchUser] Failed to parse user data constructed from ID Token claims for Google. Falling back to /userinfo.", parsedDataFromIdToken.error);
        // Fallback to userinfo endpoint if parsing fails or claims are insufficient.
      }
    }

    // Fallback or for non-OIDC providers / if ID token claims were not sufficient:
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

    if (this.provider === 'github') {  // this is cause, github made the email not a public info to access even we provide the scope
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