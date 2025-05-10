import { eq } from "drizzle-orm";

import db from "@/drizzle/db";
import { Product } from "@/drizzle/schemas/product";
import { User } from "@/drizzle/schemas/user";

async function removeGuestUserData() {
  console.log("Starting to remove guest user data...");
  
  const guestUser = await db.query.User.findFirst({
    where: eq(User.email, "guest@gmail.com")
  });

  if (!guestUser) {
    console.log("Guest user not found, nothing to remove.");
    return;
  }

  console.log(`Found guest user with ID: ${guestUser.id}`);
  
  console.log("Removing products...");
  await db.delete(Product)
    .where(eq(Product.user_id, guestUser.id));
  
  // UserSubscription will be deleted automatically due to cascade on user_id
  console.log("Removing guest user...");
  await db.delete(User)
    .where(eq(User.id, guestUser.id));
  
  console.log("✅ Guest user data successfully removed!");
}

async function main() {
  try {
    await removeGuestUserData();
  } catch (error) {
    console.error("Error removing guest user data:", error);
  } finally {
    process.exit(0);
  }
}

main().catch(console.error); 