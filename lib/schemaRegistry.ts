import { UserSchema } from "@/app/schemas/userSchema";
import { EmployeeSchema } from "@/app/schemas/employeeSchema";
import { ProductSchema } from "@/app/schemas/productSchema";

export const schemaRegistry = {
  user: UserSchema,

  product: ProductSchema,

  employee: EmployeeSchema,
};