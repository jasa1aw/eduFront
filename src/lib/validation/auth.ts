import * as z from "zod"

export const emailSchema = z
  .string()
  .min(1, "Email обязателен")
  .email("Неверный формат email")
  .max(100, "Email слишком длинный")

export const passwordSchema = z
  .string()
  .min(6, "Пароль должен содержать минимум 6 символов")
  .max(100, "Пароль слишком длинный")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру"
  )

export type AuthFormType = "signIn" | "signUp" | "signUpTeacher"

export const signInSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимальная длина пароля 6 символов"),
})

export const nameSchema = z
  .string()
  .min(2, "Имя должно содержать минимум 2 символа")
  .max(50, "Имя слишком длинное")

export const citySchema = z
  .string()
  .optional()

// Схема для регистрации студента
export const studentSignUpSchema = z.object({
  name: z.string().min(2, "Минимальная длина имени 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимальная длина пароля 6 символов"),
})

// Схема для регистрации преподавателя
export const teacherSignUpSchema = z.object({
  name: z.string().min(2, "Минимальная длина имени 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимальная длина пароля 6 символов"),
  institution: z.string().min(2, "Название учебного заведения обязательно"),
})

// Оставляем старую схему для обратной совместимости
export const signUpSchema = z.object({
  name: z.string().min(2, "Минимальная длина имени 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимальная длина пароля 6 символов"),
  institution: z.string().optional(),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  password_confirmation: passwordSchema,
}).refine((data) => data.password === data.password_confirmation, {
  message: "Пароли не совпадают",
  path: ["password_confirmation"],
})

export type SignInFormValues = z.infer<typeof signInSchema>
export type SignUpFormValues = z.infer<typeof signUpSchema>
export type StudentSignUpFormValues = z.infer<typeof studentSignUpSchema>
export type TeacherSignUpFormValues = z.infer<typeof teacherSignUpSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

