import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
  skills: z.array(z.string()),
});