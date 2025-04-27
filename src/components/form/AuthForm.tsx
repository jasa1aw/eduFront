"use client"

import api from "@/lib/axios"
import { AuthFormType, SignInFormValues, signInSchema, SignUpFormValues, signUpSchema } from "@/lib/validation/auth"
import { useAuthStore } from "@/store/auth/authStore"
import { useOTPStore } from "@/store/otp/otpStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import OTPModal from "../modal/OTPModal"

interface AuthFormProps {
  type: AuthFormType
}

const formTitles = {
  signIn: {
    title: "Вход в аккаунт",
    description: "Войдите в свой аккаунт, чтобы получить доступ к коллекции ароматов",
    buttonText: "Войти",
    altText: "Нет аккаунта?",
    altLink: "/sign-up",
    altLinkText: "Зарегистрироваться",
  },
  signUp: {
    title: "Регистрация",
    description: "Создайте аккаунт, чтобы получить доступ к коллекции ароматов",
    buttonText: "Зарегистрироваться",
    altText: "Уже есть аккаунт?",
    altLink: "/sign-in",
    altLinkText: "Войти",
  },
  signUpTeacher: {
    title: "Регистрация преподавателя",
    description: "Создайте аккаунт преподавателя, чтобы получить доступ к системе",
    buttonText: "Зарегистрироваться",
    altText: "Уже есть аккаунт?",
    altLink: "/sign-in",
    altLinkText: "Войти",
  },
} as const

const AuthForm = ({ type }: AuthFormProps) => {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { setUser, setIsAuthenticated } = useAuthStore()
  const { setOTPModalOpen, setEmail } = useOTPStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(type === "signIn" ? signInSchema : signUpSchema),
    mode: "onChange",
    defaultValues: type === "signIn"
      ? {
        email: "",
        password: "",
      }
      : {
        name: "",
        email: "",
        password: "",
      }
  })

  const onSubmit = async (data: SignInFormValues | SignUpFormValues) => {
    try {
      setError(null)
      const endpoint = type === "signIn"
        ? "auth/login"
        : type === "signUpTeacher"
          ? "auth/register-teacher"
          : "auth/register"

      const formData = type === "signIn"
        ? { email: data.email, password: data.password }
        : data

      const response = await api.post(endpoint, formData)

      if (response.status === 201) {
        if (type === "signUp" || type === "signUpTeacher") {
          // For registration, show OTP modal
          setEmail(data.email)
          setOTPModalOpen(true)
        } else {
          setUser(response.data.user)
          setIsAuthenticated(true)
          router.push('/')
        }
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "Произошла ошибка при авторизации")
      }
    }
  }

  const formConfig = formTitles[type]

  return (
    <>
      <section className="w-full border-none shadow-none bg-transparent animate-fadeIn">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {formConfig.title}
          </h2>
          <p className="text-gray-500">
            {formConfig.description}
          </p>
        </div>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            autoComplete="off"
          >
            {(type === "signUp" || type === "signUpTeacher") && (
              <FormInput
                id="name"
                label="Имя"
                type="text"
                placeholder="Ваше имя"
                error={errors.name}
                {...register("name")}
              />
            )}

            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              error={errors.email}
              autoComplete="off"
              {...register("email")}
            />

            <FormInput
              id="password"
              label="Пароль"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              autoComplete="new-password"
              {...register("password")}
            />

            <div className="flex items-center justify-between">
              {type === "signIn" && (
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                  Забыли пароль?
                </Link>
              )}
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText={type === "signIn" ? "Вход..." : "Регистрация..."}
              disabled={!isValid}
            >
              {formConfig.buttonText}
            </LoadingButton>

            <p className="text-center text-sm text-gray-500">
              {formConfig.altText}{" "}
              <Link
                href={formConfig.altLink}
                className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
              >
                {formConfig.altLinkText}
              </Link>
            </p>
          </form>
        </div>
      </section>
      <OTPModal />
    </>
  )
}

export default AuthForm
