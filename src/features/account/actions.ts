"use server"
import crypto from 'crypto'

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createTransport } from 'nodemailer';

import { getOAuthClient } from "@/app/api/oauth/_providers/base";
import db from "@/drizzle/db";
import { type OAuthProvider, TierEnum, User } from '@/drizzle/schemas';
import { signupSchema, signInSchema, sessionSchema, emailUserSchema, resetPasswordSchema } from "@/features/account/schema";
import { generateSalt, gethashedPassword, checkCredential } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { createSession } from "@/lib/session";
import { baseUrl } from "@/lib/utils";

import { assignDefaultTier } from "./db";

const SESSION_KEY: string = 'session-key'

type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
  redirectTo?: string;
};

type ForgotPasswordState = {
  message?: string;
  error?: boolean;
};

type ResetPasswordState = {
  message?: string;
  error?: boolean;
  errors?: Record<string, string[]>;
};

// Placeholder for email sending function
async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Reset your password',
    text: `Hello,\n\nYou requested a password reset. Click the link below to reset your password:\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nThis link will expire in 10 minutes.`,
    html: `<p>Hello,</p><p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p><p>This link will expire in 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully to:", email);
  } catch (e) {
    console.error("Exception sending password reset email:", e);
    throw new Error('Failed to send password reset email due to an exception.');
  }
}


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
    columns: {
      email: true,
      password: true,
      salt: true,
      id: true,
      role: true,
      name: true
    },
    with: {
      subscriptions: {
        columns: {
          tier: true
        },
      }
    }
  });

  const { success, data } = emailUserSchema.safeParse(user);
  console.log("success", success, data)
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

export async function resetPassword(
  _: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const rawFormData = Object.fromEntries(formData);
  const parsed = resetPasswordSchema.safeParse(rawFormData);

  if (!parsed.success) {
    return { error: true, message: parsed.error.message, errors: parsed.error.flatten().fieldErrors };
  }

  const { password, token } = parsed.data;

  if (!password || !token) {
    return { error: true, message: 'Password and token are required.' };
  }

  const user = await db.query.User.findFirst({
    where: eq(User.reset_password_token, token),
  });

  if (!user || !user.reset_password_expires || user.reset_password_expires < new Date()) {
    return { error: true, message: 'Invalid or expired reset token.' };
  }

  const salt = generateSalt();
  const hashedPassword = await gethashedPassword(password, salt);

  await db.update(User)
    .set({
      password: hashedPassword,
      salt: salt,
      reset_password_token: null,
      reset_password_expires: null,
    })
    .where(eq(User.id, user.id));

  return { error: false, message: 'Your password has been reset successfully.' };
}

export async function forgotPassword(
  _: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get('email')?.toString();

  if (!email) {
    return { error: true, message: 'Email address is required.' };
  }

  const user = await db.query.User.findFirst({
    where: eq(User.email, email),
  });

  if (!user) {
    console.warn(`Password reset requested for unknown email: ${email}`);
    return { error: false, message: 'If an account with that email exists, a reset link has been sent.' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 600000); // Token expires in 10 minutes

  await db.update(User)
    .set({
      reset_password_token: token,
      reset_password_expires: expires,
    })
    .where(eq(User.id, user.id));

  try {
    await sendPasswordResetEmail(email, token);
    return { error: false, message: 'If an account with that email exists, a reset link has been sent.' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { error: true, message: 'Error sending the reset email. Please try again later.' };
  }
}
