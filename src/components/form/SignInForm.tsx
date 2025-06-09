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
					router.replace(redirectPath)
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
		<div className="w-full space-y-8">
			{/* Заголовок */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold text-gray-900">Аккаунтқа кіру</h1>
				<p className="text-gray-600">
					Жүйеге кіру үшін өз аккаунтыңызға кіріңіз
				</p>
			</div>

			{/* Форма */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{error && (
					<div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
						{error}
					</div>
				)}

				<FormInput
					label="Email мекенжайы"
					type="email"
					placeholder="Email мекенжайыңызды енгізіңіз"
					{...register("email")}
					error={errors.email}
				/>

				<div className="space-y-2">
					<FormInput
						label="Құпия сөз"
						type="password"
						placeholder="Құпия сөзіңізді енгізіңіз"
						{...register("password")}
						error={errors.password}
					/>
					<div className="flex justify-end">
						<Link
							href="/forgot-password"
							className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
						>
							Құпия сөзді ұмыттыңыз ба?
						</Link>
					</div>
				</div>

				<LoadingButton
					type="submit"
					isLoading={isSubmitting}
					disabled={!isValid}
					className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
				>
					Кіру
				</LoadingButton>
			</form>
			{/* Ссылки */}
			<div className="text-center space-y-4">
				<p className="text-sm text-gray-600">
					Аккаунт жоқ па?{" "}
					<Link href={ROUTES.SIGN_UP} className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
						Тіркелу
					</Link>
				</p>
				<p className="text-sm text-gray-600">
					Оқытушы?{" "}
					<Link href={ROUTES.SIGN_UP_TEACHER} className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
						Оқытушыны тіркеу
					</Link>
				</p>
			</div>
		</div>
	)
} 