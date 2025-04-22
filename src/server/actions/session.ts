"use server"
import db from '@/db';
import { redis } from '@/redis';
import { sessionShema } from '@/schemas/auth';
import { eq } from 'drizzle-orm';
import { User } from '@/db/schema';
import { cookies } from 'next/headers';
import { SESSION_EXPIRATION, SESSION_KEY } from '../helpers/auth';
import crypto from 'crypto';
import { z } from 'zod';

type UserSession = z.infer<typeof sessionShema>

export const getUser = async () => {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_KEY)?.value;

    if (!sessionId) return null;

    const redisKey = `${SESSION_KEY}${sessionId}`;
    const redisSession = await redis.get(redisKey);

    if (!redisSession) return null;

    const parsed = sessionShema.safeParse(redisSession);
    if (!parsed.success || !parsed.data?.id) return null;

    const userId = parsed.data.id;

    const currentUser = await db.query.User.findFirst({
      where: eq(User.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return currentUser;
  } catch (error) {
    console.error('Error fetching user from session:', error);
    return null;
  }
};

export const createSession = async (user: UserSession) => {
  try {
    const sessionId = crypto.randomBytes(64).toString('hex');
    const redisKey = `${SESSION_KEY}${sessionId}`;

    // Set session in Redis
    const success = await redis.set(redisKey, JSON.stringify(user), {
      ex: SESSION_EXPIRATION,
      nx: true,
    });

    if (!success) {
      console.error('Redis did not accept the session key.');
      return new Error('Could not create session, please try again.');
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_KEY, sessionId, {
      expires: new Date(Date.now() + SESSION_EXPIRATION * 1000),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
  } catch (error) {
    console.error('Unexpected error creating session:', error);
    return new Error('Failed to create user session')
  }
};

