"use client"

import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import api from "@/lib/axios"
import { TeacherSignUpFormValues, teacherSignUpSchema } from "@/lib/validation/auth"
import { useOTPStore } from "@/store/otp/otpStore"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const TeacherSignUpForm = () => {
	const [error, setError] = useState<string | null>(null)
	const { setOTPModalOpen, setEmail } = useOTPStore()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<TeacherSignUpFormValues>({
		resolver: zodResolver(teacherSignUpSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			email: "",
			password: "",
			institution: "",
		}
	})

	const onSubmit = async (data: TeacherSignUpFormValues) => {
		try {
			setError(null)
			const response = await api.post("auth/register-teacher", data)

			if (response.status === 201) {
				setEmail(data.email)
				setOTPModalOpen(true)
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Тіркелу кезінде қате орын алды")
			}
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
			{error && (
				<div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
					{error}
				</div>
			)}

			<FormInput
				id="name"
				label="Толық аты-жөні"
				type="text"
				placeholder="Сіздің атыңыз"
				error={errors.name}
				{...register("name")}
			/>

			<FormInput
				id="institution"
				label="Оқу орны"
				type="text"
				placeholder="Сіздің оқу орныңыздың атауы"
				error={errors.institution}
				{...register("institution")}
			/>

			<FormInput
				id="email"
				label="Email мекенжайы"
				type="email"
				placeholder="your.email@example.com"
				error={errors.email}
				autoComplete="off"
				{...register("email")}
			/>

			<FormInput
				id="password"
				label="Құпия сөз"
				type="password"
				placeholder="••••••••"
				error={errors.password}
				autoComplete="new-password"
				{...register("password")}
			/>

			<LoadingButton
				type="submit"
				isLoading={isSubmitting}
				loadingText="Тіркелу..."
				disabled={!isValid}
				className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
			>
				Оқытушы ретінде тіркелу
			</LoadingButton>
		</form>
	)
} 