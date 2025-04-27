import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { oAuthProviders } from "@/drizzle/schemas/enums";

import { getOAuthClient } from "./_providers/base";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    // Validate provider using zod
    const provider = z.enum(oAuthProviders).parse(params.provider);

    // Get the authorization code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

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

    // Get the OAuth client for the provider
    const oauthClient = getOAuthClient(provider);

    // Exchange the code for user information
    const user = await oauthClient.fetchUser(code);

    console.log(user)

  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { error: "Failed to process OAuth callback" },
      { status: 500 }
    );
  }
}
