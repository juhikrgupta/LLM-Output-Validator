import { z } from "zod";

export const ProductSchema = z.object({
  productName: z.string(),

  price: z.number(),

  inStock: z.boolean(),

  tags: z.array(z.string()),
});