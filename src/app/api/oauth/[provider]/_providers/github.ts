import { z } from "zod"

import { OAuthClient } from "./base"

const envSchema = z.object({
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
});

export function createGithubOAuthClient() {
  const env = envSchema.parse(process.env);

  return new OAuthClient({
    provider: "github",
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
    scopes: ["identify", "email"],
    urls: {
      auth: "https://discord.com/oauth2/authorize",
      token: "https://discord.com/api/oauth2/token",
      user: "https://discord.com/api/users/@me",
    },
    userInfo: {
      schema: z.object({
        id: z.string(),
        username: z.string(),
        global_name: z.string().nullable(),
        email: z.string().email(),
      }),
      parser: user => ({
        id: user.id,
        name: user.global_name ?? user.username,
        email: user.email,
      }),
    },
  })
}
