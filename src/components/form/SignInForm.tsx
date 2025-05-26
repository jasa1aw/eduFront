"use client"

import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import { getDefaultRouteForRole, ROUTES, type UserRole } from "@/constants/auth"
import api from "@/lib/axios"
import { SignInFormValues, signInSchema } from "@/lib/validation/auth"
import { useAuthStore } from "@/store/auth/authStore"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

export const SignInForm = () => {
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const { setUser, setToken } = useAuthStore()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		}
	})

	const onSubmit = useCallback(async (data: SignInFormValues) => {
		try {
			setError(null)
			const response = await api.post("auth/login", {
				email: data.email,
				password: data.password
			})

			if (response.status === 201) {
				if (response.data.user) {
					setToken(response.data.token)
					setUser(response.data.user)

					// Используем функцию для получения маршрута по роли
					const redirectPath = getDefaultRouteForRole(response.data.user.role as UserRole)
					router.push(redirectPath)
				} else {
					router.push(ROUTES.HOME)
				}
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Произошла ошибка при авторизации")
			}
		}
	}, [setToken, setUser, router])

	return (
		<div className="w-full max-w-md space-y-6">
			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-900">Вход в аккаунт</h1>
				<p className="mt-2 text-sm text-gray-600">
					Войдите в свой аккаунт, чтобы получить доступ к системе
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{error && (
					<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
						{error}
					</div>
				)}

				<FormInput
					label="Email"
					type="email"
					placeholder="Введите ваш email"
					{...register("email")}
					error={errors.email}
				/>

				<FormInput
					label="Пароль"
					type="password"
					placeholder="Введите ваш пароль"
					{...register("password")}
					error={errors.password}
				/>

				<LoadingButton
					type="submit"
					isLoading={isSubmitting}
					disabled={!isValid}
					className="w-full"
				>
					Войти
				</LoadingButton>
			</form>

			<div className="text-center text-sm">
				<span className="text-gray-600">Нет аккаунта? </span>
				<Link href={ROUTES.SIGN_UP} className="text-blue-600 hover:text-blue-500">
					Зарегистрироваться
				</Link>
			</div>

			<div className="text-center text-sm">
				<span className="text-gray-600">Преподаватель? </span>
				<Link href={ROUTES.SIGN_UP_TEACHER} className="text-blue-600 hover:text-blue-500">
					Регистрация преподавателя
				</Link>
			</div>
		</div>
	)
} 