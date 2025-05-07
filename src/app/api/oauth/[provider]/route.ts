import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { oAuthProviders } from "@/drizzle/schemas/enums";
import { connectUserToAccount  } from '@/features/account/db';
import { createSession } from "@/lib/session";

import { getOAuthClient } from "../_providers/base";

const providerSchema = z.enum(oAuthProviders);

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const cookieStore = await cookies();
  let storedNonce: string | undefined = undefined;

  try {
    const { provider: oauthProvider } = await params;
    const code = request.nextUrl.searchParams.get("code")
    const error = request.nextUrl.searchParams.get("error")
    const returnedState = request.nextUrl.searchParams.get("state")

    const storedState = cookieStore.get("oauth_state")?.value;
    const storedCodeVerifier = cookieStore.get("oauth_code_verifier")?.value;

    if (oauthProvider === "google") {
      storedNonce = cookieStore.get("oauth_nonce")?.value;
      cookieStore.delete("oauth_nonce");
    }

    cookieStore.delete("oauth_state");
    cookieStore.delete("oauth_code_verifier");

    if (!storedState || !returnedState || storedState !== returnedState) {
      console.error("Invalid OAuth state. Potential CSRF attack.");
      return NextResponse.redirect(
        new URL(`/sign-in?oauthError=${encodeURIComponent(
          "Invalid state. Please try again."
        )}`, request.url)
      );
    }

    if (!storedCodeVerifier) {
      console.error("Missing PKCE code verifier.");
      return NextResponse.redirect(
        new URL(`/sign-in?oauthError=${encodeURIComponent(
          "Security check failed. Please try again."
        )}`, request.url)
      );
    }

    // Validate the provider
    if (!oauthProvider || oauthProvider === "[provider]") {
      return NextResponse.json(
        { error: "Invalid OAuth provider" },
        { status: 400 }
      );
    }
    
    const provider = providerSchema.parse(oauthProvider);

    // Additional check for nonce if it was expected (e.g. for Google OIDC)
    if (provider === "google" && !storedNonce) {
        // This check assumes an id_token will be processed for Google where nonce is vital.
        // If an id_token is received from Google and storedNonce is missing, validation should fail.
        console.error("Missing OAuth nonce for Google OIDC flow. Potential replay attack.");
        return NextResponse.redirect(
            new URL(`/sign-in?oauthError=${encodeURIComponent(
            "Security check failed (nonce missing). Please try again."
            )}`, request.url)
        );
    }

    if (error) {
      return NextResponse.json(
        { error: `OAuth error: ${error}` },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "No authorization code provided" },
        { status: 400 }
      );
    }


    const oauthClient = getOAuthClient(provider);

    const oAuthUser = await oauthClient.fetchUser(
      code as string, 
      storedCodeVerifier as string, 
      provider === "google" ? storedNonce : undefined
    );

    const user = await connectUserToAccount(oAuthUser, provider);

    const sessionResult = await createSession(user);
    if (sessionResult instanceof Error) {
      return NextResponse.redirect(
        new URL(`/sign-in?oauthError=${encodeURIComponent(sessionResult.message)}`, request.url)
      );
    }
  
    return NextResponse.redirect(new URL('/dashboard', request.url));

  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(`/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again."
      )}`, request.url)
    );
  }
}
