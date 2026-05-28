import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string(),
  age: z.number(),
  department: z.string(),
  salary: z.number(),
  isActive: z.boolean(),
});