import { z } from "zod"

import { OAuthClient } from "./base"

const envSchema = z.object({
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),

  GITHUB_CLIENT_ID_DEV: z.string(),
  GITHUB_CLIENT_SECRET_DEV: z.string(),
});

const githubUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  login: z.string(),
  email: z.string().email(),
  avatar_url: z.string().url()
})

type GithubUser = z.infer<typeof githubUserSchema>;

export type GitHubEmail = {
  email: string
  primary: boolean
  verified: boolean
  visibility: "public" | "private"
}

export function createGithubOAuthClient() {
  const env = envSchema.parse(process.env);

  const isProduction = process.env.NODE_ENV === 'production';

  return new OAuthClient<GithubUser>({
    provider: "github",
    clientId:  isProduction ? env.GITHUB_CLIENT_ID : env.GITHUB_CLIENT_ID_DEV,
    clientSecret:  isProduction ? env.GITHUB_CLIENT_SECRET : env.GITHUB_CLIENT_SECRET_DEV,
    scopes: ["user:email", "read:user"],
    urls: {
      auth: "https://github.com/login/oauth/authorize",
      token: "https://github.com/login/oauth/access_token",
      user: "https://api.github.com/user",
    },
    userInfo: {
      schema: githubUserSchema,
      parser: user => ({
        id: user.id.toString(),
        name: user.name ?? user.login,
        email: user.email,
        image: user.avatar_url ?? ""
      }),
    },
  })
}

