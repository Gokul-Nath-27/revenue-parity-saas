import { z } from "zod";

import { OAuthClient } from "./base"; // Assuming base.ts is in the same directory

export function createGoogleOAuthClient() {
  return new OAuthClient({
    provider: "google",
    // Ensure these environment variables are set
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Standard scopes for getting user ID, email, and basic profile info
    scopes: [
        "openid", // Standard OpenID scope
        "https://www.googleapis.com/auth/userinfo.email", // Access user's primary email address
        "https://www.googleapis.com/auth/userinfo.profile" // Access basic profile info (name, picture, etc.)
    ],
    urls: {
      // Google's OAuth 2.0 endpoints
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      // Standard OpenID Connect userinfo endpoint
      user: "https://www.googleapis.com/oauth2/v2/userinfo",
    },
    userInfo: {
      // Schema based on typical response from Google's userinfo endpoint
      // See: https://developers.google.com/identity/protocols/oauth2/openid-connect#obtainuserinfo
      schema: z.object({
        sub: z.string(), // Subject identifier - Google's unique ID for the user
        name: z.string().optional(), // User's full name (might not be present depending on account)
        given_name: z.string().optional(), // First name
        family_name: z.string().optional(), // Last name
        picture: z.string().url().optional(), // URL to profile picture
        email: z.string().email(), // User's primary email address
        email_verified: z.boolean().optional(), // Whether Google has verified the email
        locale: z.string().optional() // User's locale (e.g., "en")
      }),
      // Parser to map Google's response fields to your application's standard format
      parser: user => ({
        id: user.sub, // Use 'sub' as the unique identifier
        // Use full 'name' if available, otherwise fallback to constructing from given/family name, or just email if names missing
        name: user.name ?? `${user.given_name ?? ''} ${user.family_name ?? ''}`.trim() || user.email,
        email: user.email,
      }),
    },
  });
}