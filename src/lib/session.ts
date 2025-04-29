"use server"
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { cache } from 'react';

import { getUserById } from '@/features/account/db';
import { sessionSchema, type UserSession } from '@/features/account/schema';
import { redis } from '@/lib/redis';

const SESSION_EXPIRATION = 1000 * 60 * 60; // 1 hour
const SESSION_KEY: string = 'session-key'

const generateSessionId = async () => {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const createSession = async (user: UserSession) => {
  try {
    const sessionId = await generateSessionId();

    // Only store id and role in the session
    const sessionData = {
      id: user.id,
      role: user.role
    };

    const success = await saveSessionToRedis(sessionId, sessionData);
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

export async function updateSessionExpiration(sessionId: string) {
  const redisKey = `${SESSION_KEY}${sessionId}`;
  try {
    await redis.expire(redisKey, SESSION_EXPIRATION / 1000);
  } catch (error) {
    console.error('Error updating session expiration:', error);
  }
}

export async function saveSessionToRedis(sessionId: string, sessionData: UserSession) {
  const redisKey = `${SESSION_KEY}${sessionId}`;
  try {
    return await redis.set(redisKey, JSON.stringify(sessionData), {
      ex: SESSION_EXPIRATION / 1000, // Convert to seconds for Redis
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
    expires: new Date(Date.now() + SESSION_EXPIRATION),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSessionCookieOptions() {
  return {
    name: SESSION_KEY,
    value: '',
    expires: new Date(Date.now() + SESSION_EXPIRATION),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
}

export const getUser = cache(async (sessionId: string | null) => {
  if (!sessionId) redirect('/');

  const session = await getValidatedSession(sessionId);
  if (!session?.id) redirect('/');

  const user = await getUserById(session.id);
  if (!user) redirect('/');

  return user;
});