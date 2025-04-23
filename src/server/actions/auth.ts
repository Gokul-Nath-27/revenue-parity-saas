"use server"
import db from "@/drizzle/db";
import { redis } from "@/server/lib/redis";
import { eq } from "drizzle-orm";
import { User } from '@/drizzle/schema';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateSalt, gethashedPassword, checkCredential } from "@/server/lib/auth";
import { createSession } from "@/server/lib/session";
import { signupSchema, signInSchema } from "@/schemas/auth";
import { SESSION_KEY } from '@/server/constant'

type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
  redirectTo?: string;
};

export async function signup(prev: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = Object.fromEntries(formData);
  const { success, error, data } = signupSchema.safeParse(rawFormData);

  if (!success) {
    return { errors: error.flatten().fieldErrors };
  }

  const { name, email, password } = data;

  const existingUser = await db.query.User.findFirst({
    where: eq(User.email, email),
  });

  if (existingUser) {
    return {
      message: 'Email already exists, please use a different email or login.',
    };
  }

  const salt = generateSalt();
  const hashedPassword = await gethashedPassword(password, salt);

  const [user] = await db.insert(User).values({
    name,
    email,
    password: hashedPassword,
    salt,
  }).returning({
    id: User.id,
    role: User.role,
  });

  if (!user) {
    return { message: 'An error occurred while creating your account.' };
  }

  const sessionResult = await createSession(user);
  if (sessionResult instanceof Error) {
    return { message: sessionResult.message };
  }

  redirect('/dashboard')
}


export async function signout() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_KEY);

    if (!session?.value) {
      return { message: 'Session not found' };
    }

    const redisKey = `${SESSION_KEY}${session.value}`;

    // Clear session
    await redis.del(redisKey);
    cookieStore.delete(SESSION_KEY);

  } catch (error) {
    console.error('Error during signout:', error);
    return { message: 'Error signing out' };
  }
}

export async function signIn(prev: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = Object.fromEntries(formData);
  const parsed = signInSchema.safeParse(rawFormData);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const user = await db.query.User.findFirst({
    where: eq(User.email, email),
    columns: { email: true, password: true, salt: true, id: true, role: true },
  });

  if (!user || !await checkCredential(password, user.password, user.salt)) {
    return { message: 'Invalid login credentials.' };
  }

  const sessionResult = await createSession(user);
  if (sessionResult instanceof Error) {
    return { message: sessionResult.message };
  }

  redirect('/dashboard')
}
