import { z } from "zod";

import { OAuthProvider } from "@/drizzle/schemas/enums";

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
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.OAUTH_REDIRECT_URL_BASE
      : process.env.OAUTH_REDIRECT_URL_BASE_DEV;
    
    return new URL(`/api/oauth/${this.provider}`, baseUrl);
  }

  /* Step 1: */
  createAuthUrl() {
    const url = new URL(this.urls.auth);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("redirect_uri", this.redirectUrl.toString());
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", this.scopes.join(" "));

    return url.toString();
  }
  
  /* Step 2: */
  private async fetchToken(code: string) {
    const body = new URLSearchParams({
      code,
      redirect_uri: this.redirectUrl.toString(),
      grant_type: "authorization_code",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      access_type: "offline",
      approval_prompt:'force'
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

  /* Step 3: */
  async fetchUser(code: string) {
    const { accessToken, tokenType } = await this.fetchToken(code);

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

    const rawData = await userResponse.json();
    const parsedData = this.userDataSchema.safeParse(rawData);

    if (!parsedData.success && this.provider === 'github') {  // this is cause, github made the email not a public info to access even we provide the scope
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
          Accept: 'application/json',
        },
      });
  
      if (emailResponse.ok) {
        const emails: GitHubEmail[] = await emailResponse.json()
        rawData.email = (emails.find((e) => e.primary) ?? emails[0]).email
      }
    }

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