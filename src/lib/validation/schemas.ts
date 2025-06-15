import { z } from "zod";
import { citySchema, emailSchema, nameSchema } from "./auth";
export const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  city: citySchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;