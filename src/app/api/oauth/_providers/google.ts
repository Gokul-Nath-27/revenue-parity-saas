import { z } from "zod";

import { OAuthClient } from "./base";

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

const googleUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().url().optional(),
  locale: z.string().optional()
});

type GoogleUser = z.infer<typeof googleUserSchema>;

export function createGoogleOAuthClient() {
  const env = envSchema.parse(process.env);

  return new OAuthClient<GoogleUser>({
    provider: "google",
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    scopes: [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://www.googleapis.com/oauth2/v2/userinfo",
    },
    userInfo: {
      schema: googleUserSchema,
      parser: user => ({
        id: user.id,
        name: user.name ?? ((`${user.given_name ?? ''} ${user.family_name ?? ''}`.trim()) || user.email),
        email: user.email,
        image: user.picture ?? ""
      }),
    },
  });
}