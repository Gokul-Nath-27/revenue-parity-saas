import crypto from 'crypto';
import { sessionShema } from '@/server-actions/auth/schema'
import { z } from 'zod';
import { redis } from '@/redis';

type UserSession = z.infer<typeof sessionShema>

export const SESSION_EXPIRATION = 1 * 60 * 1000; // 1 minute
export const SESSION_KEY: string = 'session-key'

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
    const sessionId = crypto.randomBytes(512).toString("hex").normalize();
    // Set the session in redis
    try {
      await redis.set(`${SESSION_KEY}${sessionId}`, JSON.stringify(user), {
        ex: 60,
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

export const checkValidCredentials = async (password: string, hashedPassword: string, salt: string) => {
  const formHashPassword = await gethashedPassword(password, salt)
  return formHashPassword === hashedPassword
}