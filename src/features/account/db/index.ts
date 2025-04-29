import { eq } from "drizzle-orm";

import db, { sql } from "@/drizzle/db";
import { OAuthProvider, User } from "@/drizzle/schemas";

import { UserSession } from "../schema";

export async function getUserById(userId: string) {
  try {
    return await db.query.User.findFirst({
      where: eq(User.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  } catch (error) {
    console.error('Error fetching user from DB:', error);
    return null;
  }
}


/* 
  Manual transaction implementation since Neon HTTP driver doesn't support 
  multi-query transactions with automatic rollback
*/
export async function connectUserToAccount(
  { id, email, name }: { id: string; email: string; name: string },
  provider: OAuthProvider
) {
  // Arrays to keep track
  const createdUsers: string[] = [];
  const createdOauthAccounts: string[] = [];

  try {
    // Q1
    const userInsert = await sql`
      INSERT INTO "users" (email, name)
      VALUES (${email}, ${name})
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;

    let userId: string;

    if (userInsert.length > 0) {
      // user inserted
      userId = userInsert[0].id;
      createdUsers.push(userId);
    } else {
      // User already exists, fetch user id
      const existingUser = await sql`
        SELECT id FROM "users" WHERE email = ${email}
      `;
      if (existingUser.length === 0) {
        throw new Error('User lookup failed after insert conflict');
      }
      userId = existingUser[0].id;
    }

    // Q2
    const oauthInsert = await sql`
      INSERT INTO "user_oauth_accounts" (user_id, provider, provider_account_id)
      VALUES (${userId}, ${provider}, ${id})
      ON CONFLICT (provider_account_id, provider) DO NOTHING
      RETURNING user_id
    `;

    if (oauthInsert.length > 0) {
      createdOauthAccounts.push(oauthInsert[0].user_id);
    } else {
      // Maybe it already existed, check manually
      const existingAccount = await sql`
        SELECT user_id FROM "user_oauth_accounts"
        WHERE provider = ${provider} AND provider_account_id = ${id}
      `;
      if (existingAccount.length === 0) {
        throw new Error("OAuth account connection failed.");
      }
      createdOauthAccounts.push(existingAccount[0].user_id);
    }

    // Fetch and returning only the role and the user id (DTO)
    const [user] = await sql`
      SELECT id, role FROM "users" WHERE id = ${userId}
    `;

    return user as UserSession;
  } catch (error) {
    console.error('Transaction failed:', error);

    try {
      if (createdOauthAccounts.length > 0) {
        await sql`
          DELETE FROM "user_oauth_accounts" WHERE user_id IN (${createdOauthAccounts})
        `;
      }
      if (createdUsers.length > 0) {
        await sql`
          DELETE FROM "users" WHERE id IN (${createdUsers})
        `;
      }
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }

    throw new Error('Failed to connect user to account');
  }
}