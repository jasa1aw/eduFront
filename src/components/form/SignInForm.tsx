"use client"

import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import api from "@/lib/axios"
import { SignInFormValues, signInSchema } from "@/lib/validation/auth"
import { useAuthStore } from "@/store/auth/authStore"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const SignInForm = () => {
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const { setUser, setIsAuthenticated } = useAuthStore()

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

	const onSubmit = async (data: SignInFormValues) => {
		try {
			setError(null)
			const response = await api.post("auth/login", {
				email: data.email,
				password: data.password
			})

			if (response.status === 201) {
				if (response.data.user) {
					localStorage.setItem('auth_token', response.data.token)
					setUser(response.data.user)
					setIsAuthenticated(true)
					if (response.data.user.role === "TEACHER") {
						router.push('/teacher/stats')
					} else {
						router.push('/student/stats')
					}
				} else {
					router.push('/')
				}
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Произошла ошибка при авторизации")
			}
		}
	}

	return (
		<section className="w-full border-none shadow-none bg-transparent animate-fadeIn">
			<div className="space-y-4">
				<h2 className="text-2xl font-bold text-gray-900">
					Вход в аккаунт
				</h2>
				<p className="text-gray-500">
					Войдите в свой аккаунт, чтобы получить доступ к коллекции ароматов
				</p>
			</div>
			<div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6"
					autoComplete="off"
				>
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
						<Link
							href="/forgot-password"
							className="text-sm text-emerald-600 hover:text-emerald-500 transition-colors"
						>
							Забыли пароль?
						</Link>
					</div>

					{error && <p className="text-red-500">{error}</p>}

					<LoadingButton
						type="submit"
						isLoading={isSubmitting}
						loadingText="Вход..."
						disabled={!isValid}
					>
						Войти
					</LoadingButton>

					<p className="text-center text-sm text-gray-500">
						Нет аккаунта?{" "}
						<Link
							href="/sign-up"
							className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
						>
							Зарегистрироваться
						</Link>
					</p>
				</form>
			</div>
		</section>
	)
} 