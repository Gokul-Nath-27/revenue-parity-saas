import crypto from 'crypto';
import { sessionShema } from '@/server-actions/auth/schema'
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redis } from '@/redis';

type UserSession = z.infer<typeof sessionShema>

const SESSION_KEY = 'session-key'
const SESSION_EXPIRATION = 1 * 60 * 1000; // 1 minute

export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex').normalize();
}

export const gethashedPassword = (password: string, salt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (err, hash) => {
      if (err) reject(err)
      resolve(hash.toString('hex').normalize())
    })
  })
}

// This function is used to create a session for the user
// It generates a random session ID and stores the user information in Redis
export const createUserSession = async (user: UserSession) => {
  try {
    const cookie = await cookies();
    const sessionId = crypto.randomBytes(512).toString("hex").normalize();

    cookie.set(SESSION_KEY, sessionId, {
      httpOnly: true,
      secure: true,
      expires: Date.now() + SESSION_EXPIRATION * 1000
    });

    // Set the session in redis
    await redis.setex(sessionId, SESSION_EXPIRATION, JSON.stringify(user));
    return sessionId;
  } catch (error) {
    console.error('Error creating user session:', error);
    throw new Error('Failed to create user session');
  }
};