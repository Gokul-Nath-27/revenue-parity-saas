import { z } from "zod"
import { userRoles } from '@/db/schema';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const signupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8, { message: "Be at least 8 characters long" })
})

const sessionShema = z.object({
  id: z.number(),
  role: z.enum(userRoles)
})

export { signInSchema, signupSchema, sessionShema }