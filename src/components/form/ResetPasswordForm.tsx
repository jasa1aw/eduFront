"use client"

import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import { ROUTES } from "@/constants/auth"
import api from "@/lib/axios"
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const ResetPasswordForm = () => {
	const [isSuccess, setIsSuccess] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onChange",
		defaultValues: {
			password: "",
			password_confirmation: "",
		}
	})

	const onSubmit = async (data: ResetPasswordFormValues) => {
		try {
			if (!token) {
				toast.error("Недействительная ссылка для сброса пароля")
				return
			}

			const response = await api.post("auth/reset-password", {
				token,
				password: data.password,
				password_confirmation: data.password_confirmation
			})

			if (response.status === 200 || response.status === 201) {
				setIsSuccess(true)
				toast.success("Пароль успешно изменен")
				setTimeout(() => {
					router.push(ROUTES.SIGN_IN)
				}, 2000)
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data.message || "Произошла ошибка при сбросе пароля"
				toast.error(errorMessage)
			} else {
				toast.error("Произошла неожиданная ошибка")
			}
		}
	}

	if (isSuccess) {
		return (
			<div className="w-full space-y-8 text-center">
				{/* Иконка успеха */}
				<div className="flex justify-center">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
						<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</div>
				</div>

				{/* Заголовок */}
				<div className="space-y-2">
					<h1 className="text-3xl font-bold text-gray-900">Пароль изменен!</h1>
					<p className="text-gray-600">
						Ваш пароль был успешно изменен. Вы будете перенаправлены на страницу входа.
					</p>
				</div>

				{/* Кнопка */}
				<Link
					href={ROUTES.SIGN_IN}
					className="inline-block w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
				>
					Перейти к входу
				</Link>
			</div>
		)
	}

	return (
		<div className="w-full space-y-8">
			{/* Заголовок */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold text-gray-900">Создать новый пароль</h1>
				<p className="text-gray-600">
					Введите новый пароль для вашего аккаунта
				</p>
			</div>

			{/* Форма */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<FormInput
					label="Новый пароль"
					type="password"
					placeholder="Введите новый пароль"
					{...register("password")}
					error={errors.password}
				/>

				<FormInput
					label="Подтвердите пароль"
					type="password"
					placeholder="Повторите новый пароль"
					{...register("password_confirmation")}
					error={errors.password_confirmation}
				/>

				<LoadingButton
					type="submit"
					isLoading={isSubmitting}
					disabled={!isValid}
					className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
				>
					Изменить пароль
				</LoadingButton>
			</form>

			{/* Ссылка назад */}
			<div className="text-center">
				<Link
					href={ROUTES.SIGN_IN}
					className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors flex items-center justify-center space-x-2"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					<span>Вернуться к входу</span>
				</Link>
			</div>
		</div>
	)
} 