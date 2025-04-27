import { z } from "zod";
import { citySchema, emailSchema, nameSchema, phoneSchema } from "./auth";
export const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  city: citySchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;