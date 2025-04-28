import { eq } from "drizzle-orm";

import db, { sql } from "@/drizzle/db";
import { OAuthProvider, User } from "@/drizzle/schemas";

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
    if (userInsert.length === 0) {
      throw new Error("User insert failed.");
    }
    createdUsers.push(userInsert[0].id);

    // Q2
    const oauthInsert = await sql`
      INSERT INTO "user_oauth_accounts" (provider, "providerAccountId", "userId")
      SELECT ${provider}, ${id}, id
      FROM "users"
      WHERE email = ${email}
      ON CONFLICT DO NOTHING
      RETURNING "userId"
    `;
    if (oauthInsert.length === 0) {
      throw new Error("OAuth account connection failed.");
    }
    createdOauthAccounts.push(oauthInsert[0].userId);

    // successfull transaction
    const [user] = await sql`
      SELECT id, role FROM "users" WHERE email = ${email}
    `;
    return user;
  } catch (error) {
    console.error('Transaction failed:', error);
    
    // Manual rollback: Delete any inserted users or OAuth accounts
    try {
      if (createdOauthAccounts.length > 0) {
        await sql`
          DELETE FROM "user_oauth_accounts" WHERE "userId" IN (${createdOauthAccounts})
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