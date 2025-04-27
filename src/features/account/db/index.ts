import { eq } from "drizzle-orm";

import db from "@/drizzle/db";
import { User } from "@/drizzle/schemas";

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
