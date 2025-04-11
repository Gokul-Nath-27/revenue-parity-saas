"use server"
import db from '@/db';
import { eq } from 'drizzle-orm';
import { User } from '@/db/schema';
import {
  generateSalt,
  gethashedPassword,
  createUserSession,
  SESSION_EXPIRATION,
  checkValidCredentials,
} from '@/server-actions/auth/helpers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'
import { redis } from '@/redis';
import { signupSchema, signInSchema, sessionShema } from '@/server-actions/auth/schema';

const SESSION_KEY: string = 'session-key'

export async function signupAction(prev: Error | null, formData: FormData) {

  const rawFormData = Object.fromEntries(formData);

  // Validate the form data
  const validationObject = signupSchema.safeParse(rawFormData)
  if (!validationObject.success) {
    return new Error("Invalid form data")
  }

  // check the user email already exist
  const { name, email, password } = validationObject.data

  const existingUser = await db.query.User.findFirst({
    where: eq(User.email, email)
  })

  if (existingUser) return new Error("User already exists")


  const salt = generateSalt()
  const hashPassword = await gethashedPassword(password, salt)

  const [user] = await db.insert(User).values({
    name,
    email,
    password: hashPassword,
    salt
  }).returning({
    id: User.id,
    role: User.role,
  })

  if (!user) return new Error("Failed to create user")

  // Session management

  const sessionId = await createUserSession(user)

  if (sessionId instanceof Error) return new Error("Failed to create session")

  // Set the session in cookies
  const cookieStore = await cookies()

  cookieStore.set(SESSION_KEY, sessionId, {
    expires: new Date(Date.now() + SESSION_EXPIRATION * 2),
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  })

  redirect('/dashboard')
};

export async function signoutAction() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_KEY)
  if (!sessionId) return new Error("Session not found")

  // Delete the session from redis
  await redis.del(sessionId.value)

  // Delete the session from cookies
  cookieStore.delete(SESSION_KEY)

  redirect('/')
}

export async function signInAction(prev: Error | string, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  // Validate the form data
  const validationObject = signInSchema.safeParse(rawFormData)
  if (!validationObject.success) {
    return new Error("Invalid form data")
  }
  // check the user email already exist
  const { email, password } = validationObject.data
  const user = await db.query.User.findFirst({
    where: eq(User.email, email),
    columns: {
      email: true,
      password: true,
      salt: true,
    }
  })

  if (!user) return new Error("User not found")

  const { password: hashedPassword, salt } = user

  const isValidCredential = checkValidCredentials(password, hashedPassword, salt)
}

export const getCurrentUser = async () => {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_KEY)?.value
  if (!sessionId) return null

  const redisSession = await redis.get(sessionId)
  const { data: user, success } = sessionShema.safeParse(redisSession)

  return success ? user : null
};