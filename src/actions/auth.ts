"use server"

import { signupSchema } from '@/components/auth/schema';
import redisClient from '@/redis';
import db from '@/db';
import { eq } from 'drizzle-orm';
import { User } from '@/db/schema';
import crypto from 'crypto';

const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex');
}

const gethashedPassword = (password: string, salt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (err, hash) => {
      if (err) reject(err)
      resolve(hash.toString('hex'))
    })
  })
}
 

export async function signupAction(prevState: object, formData: FormData): Promise<object> {
  const formDataObject = Object.fromEntries(formData) as { name: string, email: string, password: string }
  const validationObject = signupSchema.safeParse(formDataObject)

  if (!validationObject.success) {
    return { error: validationObject.error.message }
  }

  const { name, email, password } = formDataObject;

  const existingUser = await db.query.User.findFirst({
    where: eq(User.email, email as string)
  })

  if (existingUser) return { error: "User email already exists" }

  const salt = generateSalt()
  const hashPassword = await gethashedPassword(password as string, salt)

  const [user] = await db.insert(User).values({
    name,
    email,
    password: hashPassword,
    salt
  }).returning({
    id: User.id,
    role: User.role,
  })

  if (!user) return { error: "Failed to create user" }

  return { user }
}