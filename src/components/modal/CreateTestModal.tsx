'use client'
import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import { useCreateTest } from "@/hooks/useCreateTest"
import { zodResolver } from "@hookform/resolvers/zod"
import { log } from 'console'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const createTestSchema = z.object({
	title: z.string().min(1, "Название теста обязательно"),
	maxAttempts: z.number().min(1, "Минимум 1 попытка"),
	timeLimit: z.number().min(1, "Минимум 1 минута"),
})

type CreateTestFormValues = z.infer<typeof createTestSchema>

interface CreateTestModalProps {
	isOpen: boolean
	onClose: () => void
}

export default function CreateTestModal({ isOpen, onClose }: CreateTestModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<CreateTestFormValues>({
		resolver: zodResolver(createTestSchema),
		defaultValues: {
			title: "Новый тест",
			maxAttempts: 3,
			timeLimit: 120
		}
	})

	const mutation = useCreateTest()

	const handleClose = () => {
		mutation.reset()
		reset()
		onClose()
	}

	const onSubmit = (data: CreateTestFormValues) => {
		mutation.mutate({
			...data,
			isDraft: true,
			showAnswers: false
		})
		if (mutation.isSuccess) console.log('is success')
		if (mutation.isPending) console.log('is pending')
		if (mutation.isError) console.log('is error')
		reset()
		onClose()
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h2 className="text-2xl font-bold mb-4">Создать новый тест</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FormInput
						id="title"
						label="Название теста"
						type="text"
						placeholder="Введите название теста"
						error={errors.title}
						{...register("title")}
					/>

					<FormInput
						id="maxAttempts"
						label="Максимальное количество попыток"
						type="number"
						placeholder="Введите количество попыток"
						error={errors.maxAttempts}
						{...register("maxAttempts", { valueAsNumber: true })}
					/>
					
					{mutation.isError && (
						<p className="text-red-500 text-sm">
							{mutation.error instanceof Error ? mutation.error.message : "Произошла ошибка при создании теста"}
						</p>
					)}

					<div className="flex justify-end space-x-3 mt-6">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 text-gray-600 hover:text-gray-800"
						>
							Отмена
						</button>
						<LoadingButton
							type="submit"
							isLoading={mutation.isPending}
							loadingText="Создание..."
						>
							Создать
						</LoadingButton>
					</div>
				</form>
			</div>
		</div>
	)
} 