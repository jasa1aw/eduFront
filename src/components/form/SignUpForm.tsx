"use client"

import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import api from "@/lib/axios"
import { SignUpFormValues, signUpSchema } from "@/lib/validation/auth"
import { useOTPStore } from "@/store/otp/otpStore"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface SignUpFormProps {
	isTeacher?: boolean
}

export const SignUpForm = ({ isTeacher: initialIsTeacher = false }: SignUpFormProps) => {
	const [error, setError] = useState<string | null>(null)
	const [isTeacher, setIsTeacher] = useState(initialIsTeacher)
	const { setOTPModalOpen, setEmail } = useOTPStore()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
		reset
	} = useForm<SignUpFormValues & { institution?: string }>({
		resolver: zodResolver(signUpSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			email: "",
			password: "",
			institution: "",
		}
	})

	const onSubmit = async (data: SignUpFormValues & { institution?: string }) => {
		try {
			setError(null)
			const endpoint = isTeacher ? "auth/register-teacher" : "auth/register"

			// Подготавливаем данные для отправки
			const submitData = isTeacher
				? { ...data, institution: data.institution || "" }
				: { name: data.name, email: data.email, password: data.password }

			const response = await api.post(endpoint, submitData)

			if (response.status === 201) {
				setEmail(data.email)
				setOTPModalOpen(true)
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Произошла ошибка при регистрации")
			}
		}
	}

	const handleToggleUserType = () => {
		setIsTeacher(!isTeacher)
		setError(null)
		// Сбрасываем форму при переключении
		reset({
			name: "",
			email: "",
			password: "",
			institution: "",
		})
	}

	const title = isTeacher ? "Регистрация преподавателя" : "Регистрация"
	const description = isTeacher
		? "Создайте аккаунт преподавателя, чтобы получить доступ к системе"
		: "Создайте аккаунт, чтобы получить доступ к коллекции ароматов"

	return (
		<section className="w-full border-none shadow-none bg-transparent animate-fadeIn">
			<div className="space-y-4">
				<h2 className="text-2xl font-bold text-gray-900">
					{title}
				</h2>
				<p className="text-gray-500">
					{description}
				</p>

				{/* Переключатель типа регистрации */}
				<div className="flex items-center justify-center space-x-1 bg-gray-100 rounded-lg p-1">
					<button
						type="button"
						onClick={handleToggleUserType}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${!isTeacher
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'
							}`}
					>
						Студент
					</button>
					<button
						type="button"
						onClick={handleToggleUserType}
						className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isTeacher
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-600 hover:text-gray-900'
							}`}
					>
						Преподаватель
					</button>
				</div>
			</div>
			<div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6"
					autoComplete="off"
				>
					<FormInput
						id="name"
						label="Имя"
						type="text"
						placeholder="Ваше имя"
						error={errors.name}
						{...register("name")}
					/>

					{isTeacher && (
						<FormInput
							id="institution"
							label="Учебное заведение"
							type="text"
							placeholder="Название вашего учебного заведения"
							error={errors.institution}
							{...register("institution")}
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

					{error && <p className="text-red-500">{error}</p>}

					<LoadingButton
						type="submit"
						isLoading={isSubmitting}
						loadingText="Регистрация..."
						disabled={!isValid}
					>
						Зарегистрироваться
					</LoadingButton>

					<p className="text-center text-sm text-gray-500">
						Уже есть аккаунт?{" "}
						<Link
							href="/sign-in"
							className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
						>
							Войти
						</Link>
					</p>
				</form>
			</div>
		</section>
	)
} 