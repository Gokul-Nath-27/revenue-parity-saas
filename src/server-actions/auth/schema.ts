import { z } from "zod"
import { userRoles } from '@/db/schema';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const signupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
})

const sessionShema = z.object({
  id: z.number(),
  role: z.enum(userRoles)
})

export { loginSchema, signupSchema, sessionShema }