import "server-only"
import db from '@/db';
import { redis } from '@/redis';
import { sessionShema } from '@/schemas/auth';
import { eq } from 'drizzle-orm';
import { User } from '@/db/schema';
import { cookies } from 'next/headers';
import { SESSION_KEY } from '../helpers/auth';
import crypto from 'crypto';
import { z } from 'zod';

type UserSession = z.infer<typeof sessionShema>

export const getCurrentUser = async () => {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_KEY)?.value
  if (!sessionId) return null

  const redisSession = await redis.get(`${SESSION_KEY}${sessionId}`)
  const { data: user, success } = sessionShema.safeParse(redisSession)

  if (!success || !user?.id) return null
  // Fetch the user from the database
  const currentUser = await db.query.User.findFirst({
    where: eq(User.id, user.id),
    columns: {
      name: true,
      email: true,
      id: true,
      role: true,
    }
  })

  return currentUser
};

// This function is used to create a session for the user
// It generates a random session ID and stores the user information in Redis
export const createUserSession = async (user: UserSession) => {
  try {
    const sessionId = crypto.randomBytes(512).toString("hex").normalize();
    // Set the session in redis
    try {
      await redis.set(`${SESSION_KEY}${sessionId}`, JSON.stringify(user), {
        ex: 60 * 60, // 1 hour,
        nx: true,
      });
    }
    catch (error) {
      console.error('Error setting session in Redis:', error);
      return new Error('Failed to set session in Redis');
    }
    return sessionId;
  } catch (error) {
    console.error('Error creating user session:', error);
    return new Error('Failed to create user session');
  }
};

