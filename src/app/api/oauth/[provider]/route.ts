import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { oAuthProviders } from "@/drizzle/schemas/enums";
import { connectUserToAccount } from '@/features/account/db'

import { getOAuthClient } from "../_providers/base";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {

    const { provider: oauthProvider  } = await params
    const provider = await z.enum(oAuthProviders).parseAsync(oauthProvider);

    // Get the authorization code from the URL
    const searchParams = await request.nextUrl.searchParams;
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
    const oAuthUser = await oauthClient.fetchUser(code);
    const user = await connectUserToAccount(oAuthUser, provider)


    return NextResponse.json(
      { user },
      { status: 201 }
    );

  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { error: "Failed to process OAuth callback" },
      { status: 500 }
    );
  }
}