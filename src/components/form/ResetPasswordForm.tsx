"use client"

import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import { ROUTES } from "@/constants/auth"
import { useResetPassword } from "@/hooks/auth/useResetPassword"
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const ResetPasswordForm = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const email = searchParams.get('email')
	const resetPasswordMutation = useResetPassword()

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onChange",
		defaultValues: {
			password: "",
			password_confirmation: "",
		}
	})

	const onSubmit = async (data: ResetPasswordFormValues) => {
		if (!token) {
			toast.error("Құпия сөзді қалпына келтіру сілтемесі жарамсыз")
			return
		}

		if (!email) {
			toast.error("Сілтемеде Email табылмады")
			return
		}

		resetPasswordMutation.mutate({
			email,
			token,
			newPassword: data.password
		}, {
			onSuccess: () => {
				toast.success("Құпия сөз сәтті өзгертілді")
				setTimeout(() => {
					router.push(ROUTES.SIGN_IN)
				}, 2000)
			},
			onError: (error) => {
				if (axios.isAxiosError(error)) {
					const errorMessage = error.response?.data.message || "Құпия сөзді қалпына келтіру кезінде қате орын алды"
					toast.error(errorMessage)
				} else {
					toast.error("Күтпеген қате орын алды")
				}
			}
		})
	}

	if (resetPasswordMutation.isSuccess) {
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
					<h1 className="text-3xl font-bold text-gray-900">Құпия сөз өзгертілді!</h1>
					<p className="text-gray-600">
						Сіздің құпия сөзіңіз сәтті өзгертілді. Сіз кіру бетіне бағытталасыз.
					</p>
				</div>

				{/* Кнопка */}
				<Link
					href={ROUTES.SIGN_IN}
					className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
				>
					Кіруге өту
				</Link>
			</div>
		)
	}

	return (
		<div className="w-full space-y-8">
			{/* Заголовок */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold text-gray-900">Жаңа құпия сөз құру</h1>
				<p className="text-gray-600">
					Аккаунтыңыз үшін жаңа құпия сөз енгізіңіз
				</p>
			</div>

			{/* Показать ошибку если есть */}
			{resetPasswordMutation.isError && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-sm text-red-800">
						{axios.isAxiosError(resetPasswordMutation.error)
							? resetPasswordMutation.error.response?.data.message || "Құпия сөзді қалпына келтіру кезінде қате орын алды"
							: "Күтпеген қате орын алды"
						}
					</p>
				</div>
			)}

			{/* Форма */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<FormInput
					label="Жаңа құпия сөз"
					type="password"
					placeholder="Жаңа құпия сөзді енгізіңіз"
					{...register("password")}
					error={errors.password}
				/>

				<FormInput
					label="Құпия сөзді растау"
					type="password"
					placeholder="Жаңа құпия сөзді қайталаңыз"
					{...register("password_confirmation")}
					error={errors.password_confirmation}
				/>

				<LoadingButton
					type="submit"
					isLoading={resetPasswordMutation.isPending}
					disabled={!isValid || resetPasswordMutation.isPending}
					className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
				>
					Құпия сөзді өзгерту
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
					<span>Кіруге оралу</span>
				</Link>
			</div>
		</div>
	)
} 