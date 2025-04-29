"use server"
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getOAuthClient } from "@/app/api/oauth/_providers/base";
import db from "@/drizzle/db";
import { type OAuthProvider, TierEnum, User } from '@/drizzle/schemas';
import { signupSchema, signInSchema, sessionSchema, emailUserSchema } from "@/features/account/schema";
import { generateSalt, gethashedPassword, checkCredential } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { createSession } from "@/lib/session";

import { assignDefaultTier } from "./db";

const SESSION_KEY: string = 'session-key'

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

  // Assign default tier to new user
  await assignDefaultTier(user.id);

  const sessionResult = await createSession({ ...user, tier: TierEnum.enumValues[0] });
  if (sessionResult instanceof Error) {
    return { message: sessionResult.message };
  }

  redirect('/dashboard')
}

export async function signout() {
  try {
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
    with: {
      subscriptions: {
        columns: {
          tier: true
        },
      }
    }
  });

  const { success, data } = emailUserSchema.safeParse(user);
  if (!success) {
    return { message: 'Invalid login credentials.' };
  }

  if (!await checkCredential(password, data.password, data.salt)) {
    return { message: 'Invalid login credentials.' };
  }

  const sessionResult = await createSession(sessionSchema.parse({ ...data, tier: user?.subscriptions.tier || TierEnum.enumValues[0] }));
  if (sessionResult instanceof Error) {
    return { message: sessionResult.message };
  }

  redirect('/dashboard')
}

export async function oAuthSignIn(provider: OAuthProvider) {
  const oAuthClient = getOAuthClient(provider)
  redirect(oAuthClient.createAuthUrl())
}
