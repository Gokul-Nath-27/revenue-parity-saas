import { z } from "zod"

import { OAuthProvider } from "@/drizzle/schemas/enums"

// Schema definitions
const googleUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  verified_email: z.boolean(),
  name: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string().url().optional(),
  locale: z.string().optional(),
})

type GoogleUser = z.infer<typeof googleUserSchema>

// Configuration
const googleOAuthConfig = {
  provider: "google" as OAuthProvider,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  scopes: [
    "https://www.googleapis.com/auth/userinfo.email", 
    "https://www.googleapis.com/auth/userinfo.profile", 
    "openid"
  ],
  urls: {
    auth: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    user: "https://www.googleapis.com/oauth2/v1/userinfo",
  },
}

// Pure parser function
const parseGoogleUser = (data: GoogleUser) => ({
  id: data.id,
  email: data.email,
  name: data.name,
})

// Factory function
export const createGoogleOAuthClient = () => ({
  // Configuration
  ...googleOAuthConfig,
  
  // User parsing
  userInfo: {
    schema: googleUserSchema,
    parse: parseGoogleUser,
  },
})