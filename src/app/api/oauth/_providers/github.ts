import { z } from "zod"

import { OAuthClient } from "./base"

const envSchema = z.object({
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

const githubUserSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  login: z.string(),
  email: z.string().email().nullable(),
  avatar_url: z.string().url()
})

type GithubUser = z.infer<typeof githubUserSchema>;

export function createGithubOAuthClient() {
  const env = envSchema.parse(process.env);

  return new OAuthClient<GithubUser>({
    provider: "github",
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
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
        email: user.email ?? `${user.login}@users.noreply.github.com`,
        image: user.avatar_url ?? ""
      }),
    },
  })
}

