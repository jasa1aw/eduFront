"use client"

import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import { ROUTES } from "@/constants/auth"
import { useForgotPassword } from "@/hooks/useForgotPassword"
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/lib/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const ForgotPasswordForm = () => {
	const forgotPasswordMutation = useForgotPassword()

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		getValues,
		reset
	} = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
		}
	})

	const onSubmit = async (data: ForgotPasswordFormValues) => {
		forgotPasswordMutation.mutate(data, {
			onSuccess: () => {
				toast.success("Ссылка для восстановления пароля отправлена на ваш email")
			},
			onError: (error) => {
				if (axios.isAxiosError(error)) {
					const errorMessage = error.response?.data.message || "Произошла ошибка при отправке запроса"
					toast.error(errorMessage)
				} else {
					toast.error("Произошла неожиданная ошибка")
				}
			}
		})
	}

	const handleTryAgain = () => {
		forgotPasswordMutation.reset()
		reset()
	}

	if (forgotPasswordMutation.isSuccess) {
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
					<h1 className="text-3xl font-bold text-gray-900">Проверьте ваш email</h1>
					<p className="text-gray-600">
						Мы отправили ссылку для восстановления пароля на{" "}
						<span className="font-medium text-gray-900">{getValues("email")}</span>
					</p>
				</div>

				{/* Инструкции */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<p className="text-sm text-blue-800">
						Не получили письмо? Проверьте папку "Спам" или попробуйте еще раз
					</p>
				</div>

				{/* Кнопки */}
				<div className="space-y-4">
					<button
						onClick={handleTryAgain}
						className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
					>
						Попробовать еще раз
					</button>
					<Link
						href={ROUTES.SIGN_IN}
						className="w-full h-12 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
					>
						Вернуться к входу
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full space-y-8">
			{/* Заголовок */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold text-gray-900">Забыли пароль?</h1>
				<p className="text-gray-600">
					Введите ваш email адрес и мы отправим вам ссылку для восстановления пароля
				</p>
			</div>

			{/* Показать ошибку если есть */}
			{forgotPasswordMutation.isError && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-sm text-red-800">
						{axios.isAxiosError(forgotPasswordMutation.error)
							? forgotPasswordMutation.error.response?.data.message || "Произошла ошибка при отправке запроса"
							: "Произошла неожиданная ошибка"
						}
					</p>
				</div>
			)}

			{/* Форма */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<FormInput
					label="Email Address"
					type="email"
					placeholder="Введите ваш email"
					{...register("email")}
					error={errors.email}
				/>

				<LoadingButton
					type="submit"
					isLoading={forgotPasswordMutation.isPending}
					disabled={!isValid || forgotPasswordMutation.isPending}
					className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
				>
					Отправить ссылку
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