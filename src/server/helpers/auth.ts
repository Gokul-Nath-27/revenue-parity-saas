import crypto from 'crypto';
import { sessionShema } from '@/schemas/auth'
import { z } from 'zod';

type UserSession = z.infer<typeof sessionShema>

export const SESSION_EXPIRATION = 1000 * 60  * 60; // 1 hour
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

export const checkValidCredentials = async (password: string, hashedPassword: string, salt: string) => {
  const formHashPassword = await gethashedPassword(password, salt)
  return formHashPassword === hashedPassword
}

