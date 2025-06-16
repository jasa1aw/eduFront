'use client'
import { FormInput } from "@/components/ui/form-input"
import { LoadingButton } from "@/components/ui/loading-button"
import { Switch } from "@/components/ui/switch"
import { useCreateTest } from "@/hooks/test/useCreateTest"
import { zodResolver } from "@hookform/resolvers/zod"
import { Shield, X } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const createTestSchema = z.object({
	title: z.string().min(1, "Тест атауы міндетті"),
	maxAttempts: z.number().min(1, "Минимум 1 әрекет"),
	timeLimit: z.number().min(1, "Минимум 1 минут"),
	examMode: z.boolean(),
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
		control,
		formState: { errors },
		reset,
		watch
	} = useForm<CreateTestFormValues>({
		resolver: zodResolver(createTestSchema),
		defaultValues: {
			title: "",
			maxAttempts: 3,
			timeLimit: 60,
			examMode: false,
		}
	})

	const mutation = useCreateTest()
	// const examMode = watch("examMode")

	const handleClose = () => {
		mutation.reset()
		reset()
		onClose()
	}

	const onSubmit = (data: CreateTestFormValues) => {
		mutation.mutate({
			...data,
			isDraft: true,
			showAnswers: false,
		}, {
			onSuccess: () => {
				reset()
				onClose()
			}
		})
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
				{/* Header */}
				<div className="relative bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-2xl p-6 text-white">
					<button
						onClick={handleClose}
						className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
					>
						<X size={20} />
					</button>
					<h2 className="text-2xl font-bold">Жаңа тест құру</h2>
					<p className="text-purple-100 mt-1">Тестіңіздің параметрлерін орнатыңыз</p>
				</div>

				{/* Content */}
				<div className="p-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Title Input */}
						<div className="space-y-2">
							<FormInput
								id="title"
								label="Тест атауы"
								type="text"
								placeholder="Тест атауын енгізіңіз"
								error={errors.title}
								{...register("title")}
								className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
							/>
						</div>

						{/* Settings Grid */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<FormInput
									id="maxAttempts"
									label="Әрекеттер"
									type="number"
									placeholder="3"
									error={errors.maxAttempts}
									{...register("maxAttempts", { valueAsNumber: true })}
									className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									id="timeLimit"
									label="Уақыт (мин)"
									type="number"
									placeholder="60"
									error={errors.timeLimit}
									{...register("timeLimit", { valueAsNumber: true })}
									className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
								/>
							</div>
						</div>

						{/* Settings Cards */}
						<div className="space-y-4">
							{/* Exam Mode */}
							<div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
								<Controller
									name="examMode"
									control={control}
									render={({ field }) => (
										<Switch
											id="examMode"
											checked={field.value}
											onChange={field.onChange}
											label="Емтихан режимі"
											description="Шектеулі мүмкіндіктері бар қатаң режим"
										/>
									)}
								/>
								<div className="flex items-center mt-2 text-purple-700">
									<Shield size={16} className="mr-2" />
									<span className="text-sm">Жоғары қауіпсіздік</span>
								</div>
							</div>
						</div>

						{/* Error Message */}
						{mutation.isError && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-3">
								<p className="text-red-600 text-sm">
									{mutation.error instanceof Error ? mutation.error.message : "Тест құру кезінде қате орын алды"}
								</p>
							</div>
						)}

						{/* Actions */}
						<div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
							<button
								type="button"
								onClick={handleClose}
								className="px-6 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
							>
								Бас тарту
							</button>
							<LoadingButton
								type="submit"
								isLoading={mutation.isPending}
								loadingText="Құрылуда..."
								className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
							>
								Тест құру
							</LoadingButton>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
} 