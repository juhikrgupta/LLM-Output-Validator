import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),

  age: z.number(),

  email: z.string().email(),

  skills: z.array(z.string()),
});

export type UserType = z.infer<typeof UserSchema>;