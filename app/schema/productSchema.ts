import { z } from "zod";

export const productSchema = z.object({
  productName: z.string(),
  price: z.number(),
  category: z.string(),
  inStock: z.boolean(),
});