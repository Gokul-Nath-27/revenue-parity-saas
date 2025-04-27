import { z } from "zod"

import { OAuthClient } from "./base"

export function createGithubOAuthClient() {
  return new OAuthClient({
    provider: "github",
    clientId: process.env.DISCORD_CLIENT_ID as string,
    clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
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
