import { z } from "zod"
const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const signupSchema = authSchema.extend({
  name: z.string().min(1),
})

export { authSchema, signupSchema }