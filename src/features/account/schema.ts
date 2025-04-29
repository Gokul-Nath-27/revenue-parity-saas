import { z } from "zod"

import { userRoles, TierEnum } from '@/drizzle/schemas';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const signupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8, { message: "Be at least 8 characters long" })
})

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
  tier: z.enum(TierEnum.enumValues)
})

const emailUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  salt: z.string(),
  role: z.enum(userRoles)
})

export type UserSession = z.infer<typeof sessionSchema>
export type EmailUser = z.infer<typeof emailUserSchema>

export { signInSchema, signupSchema, sessionSchema, emailUserSchema }