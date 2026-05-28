import { z } from "zod";

export const schemaRegistry = {
  user: z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
    skills: z.array(z.string()),
  }),

  product: z.object({
    productName: z.string(),
    price: z.number(),
    category: z.string(),
    inStock: z.boolean(),
  }),

  employee: z.object({
    name: z.string(),
    age: z.number(),
    department: z.string(),
    salary: z.number(),
    isActive: z.boolean(),
  }),
};