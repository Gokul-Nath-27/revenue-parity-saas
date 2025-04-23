"use server"
import { redis } from '@/server/lib/redis';
import { sessionSchema, type UserSession } from '@/schemas/auth';
import { cookies } from 'next/headers';
import { SESSION_EXPIRATION, SESSION_KEY } from '@/server/constant';
import crypto from 'crypto';

const generateSessionId = () => {
  return crypto.randomBytes(64).toString('hex').normalize();
};

export const createSession = async (user: UserSession) => {
  try {
    const sessionId = generateSessionId();

    const success = await saveSessionToRedis(sessionId, user);
    if (!success) {
      return new Error('Could not create session, please try again.');
    }

    await setSessionCookie(sessionId);

  } catch (error) {
    console.error('Unexpected error creating session:', error);
    return new Error('Failed to create user session');
  }
};



export async function getSessionIdFromCookie() {
  const sessionCookie = (await cookies()).get(SESSION_KEY);
  return sessionCookie?.value ?? null;
}

export async function getValidatedSession(sessionId: string) {
  const redisKey = `${SESSION_KEY}${sessionId}`;

  try {
    const redisSession = await redis.get(redisKey);
    if (!redisSession) return null;

    const parsed = sessionSchema.safeParse(redisSession);
    if (!parsed.success || !parsed.data?.id) return null;

    return parsed.data;
  } catch (error) {
    console.error('Error validating session from Redis:', error);
    return null;
  }
}

export async function saveSessionToRedis(sessionId: string, user: UserSession) {
  const redisKey = `${SESSION_KEY}${sessionId}`;
  try {
    return await redis.set(redisKey, JSON.stringify(user), {
      ex: SESSION_EXPIRATION,
      nx: true,
    });
  } catch (error) {
    console.error('Error setting session in Redis:', error);
    return false;
  }
}

export async function setSessionCookie(sessionId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEY, sessionId, {
    expires: new Date(Date.now() + SESSION_EXPIRATION * 1000),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}
