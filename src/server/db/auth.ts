import db from "@/db";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";

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
