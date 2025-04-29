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
  try {
    const { provider: oauthProvider } = await params;
    const code = request.nextUrl.searchParams.get("code")
    const error = request.nextUrl.searchParams.get("error")

    // Validate the provider
    if (!oauthProvider || oauthProvider === "[provider]") {
      return NextResponse.json(
        { error: "Invalid OAuth provider" },
        { status: 400 }
      );
    }

    const provider = providerSchema.parse(oauthProvider);


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

    const oAuthUser = await oauthClient.fetchUser(code as string);

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
