import { UserSchema } from "@/app/schema/userSchema";
import { EmployeeSchema } from "@/app/schema/employeeSchema";
import { ProductSchema } from "@/app/schema/productSchema";

export const schemaRegistry = {
  user: UserSchema,

  product: ProductSchema,

  employee: EmployeeSchema,
};