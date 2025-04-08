"use server"

import { signupSchema } from '@/server-actions/auth/schema';
import db from '@/db';
import { eq } from 'drizzle-orm';
import { User } from '@/db/schema';
import { generateSalt, gethashedPassword, createUserSession } from '@/server-actions/auth/helpers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


export async function signupAction(state: string, formData: FormData) {

  const rawFormData = Object.fromEntries(formData);

  // Validate the form data
  const validationObject = signupSchema.safeParse(rawFormData)
  if (!validationObject.success) {
    return "Invalid form data"
  }

  // check the user email already exist
  const { name, email, password } = validationObject.data

  const existingUser = await db.query.User.findFirst({
    where: eq(User.email, email)
  })

  if (existingUser) return "User already exists"


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

  if (!user) return "Failed to create user"

  // Session management

  const session = createUserSession(user)
  console.log('session', session)
  if (!session) return "Failed to create session"

  console.log('Ran the action')

  return "User created successfully"
};