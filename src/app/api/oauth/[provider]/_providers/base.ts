import { z } from "zod";

import { OAuthProvider } from "@/drizzle/schemas/enums";

import { createGithubOAuthClient } from "./github";
import { createGoogleOAuthClient } from "./google";


export class OAuthClient<T> {
  private readonly provider: OAuthProvider;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly scopes: string[];
  private readonly urls: {
    auth: string;
    token: string;
    user: string;
  };
  private readonly userInfo: {
    schema: z.ZodSchema<T>;
    parser: (data: T) => { id: string; email: string; name: string };
  };
  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
  });

  constructor({
    provider,
    clientId,
    clientSecret,
    scopes,
    urls,
    userInfo,
  }: {
    provider: OAuthProvider;
    clientId: string;
    clientSecret: string;
    scopes: string[];
    urls: {
      auth: string;
      token: string;
      user: string;
    };
    userInfo: {
      schema: z.ZodSchema<T>;
      parser: (data: T) => { id: string; email: string; name: string };
    };
  }) {
    this.provider = provider;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scopes = scopes;
    this.urls = urls;
    this.userInfo = userInfo;
  }

  private get redirectUrl() {
    const baseUrl = process.env.OAUTH_REDIRECT_URL_BASE;
    if (!baseUrl) {
      throw new Error('OAUTH_REDIRECT_URL_BASE environment variable is not defined');
    }
    
    // Ensure OAUTH_REDIRECT_URL_BASE ends with a '/' if providers don't start with one
    const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    return new URL(this.provider, base);
  }

  createAuthUrl() {
    // State is removed - WARNING: Increases CSRF risk
    // Code Verifier (PKCE) is removed - WARNING: Increases code interception risk

    const url = new URL(this.urls.auth);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("redirect_uri", this.redirectUrl.toString());
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", this.scopes.join(" "));

    return url.toString();
  }

  // Removed 'state' and 'cookies' arguments as they are no longer used for validation here
  async fetchUser(code: string) {
    // Removed state validation logic

    // Removed code_verifier retrieval logic
    const { accessToken, tokenType } = await this.fetchToken(code);

    const userResponse = await fetch(this.urls.user, {
      headers: {
        // Ensure correct capitalization based on provider requirements
        Authorization: `${tokenType} ${accessToken}`,
        // Some APIs might require other headers like 'Accept: application/json'
        'Accept': 'application/json'
      },
    });

    if (!userResponse.ok) {
        // Handle non-successful responses (e.g., 401 Unauthorized, 403 Forbidden)
        const errorBody = await userResponse.text();
        throw new Error(`Failed to fetch user info: ${userResponse.status} ${userResponse.statusText} - ${errorBody}`);
    }

    const rawData = await userResponse.json();
    const parsedUserInfo = this.userInfo.schema.safeParse(rawData);

    if (!parsedUserInfo.success) {
      throw new InvalidUserError(parsedUserInfo.error);
    }

    return this.userInfo.parser(parsedUserInfo.data);
  }

  private async fetchToken(code: string) {
    const body = new URLSearchParams({
      code,
      redirect_uri: this.redirectUrl.toString(),
      grant_type: "authorization_code",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

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
    return {
      accessToken: parsedToken.data.access_token,
      tokenType: tokenType,
    };
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

// --- Error Classes ---

class InvalidTokenError extends Error {
  public cause: z.ZodError;
  constructor(zodError: z.ZodError) {
    // Provide more context in the error message
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