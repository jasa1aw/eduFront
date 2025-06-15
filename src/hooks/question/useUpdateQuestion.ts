import { QuestionType } from '@/components/question/QuestionTypeStep'
import { Question } from '@/types/question'
import api from '@/lib/axios'
import { useQuestionStore } from '@/store/questionStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface UpdateQuestionPayload {
	testId: string
	questionId: string
	title?: string
	type?: QuestionType
	options?: string[]
	correctAnswers?: string[]
	explanation?: string
	weight?: number
	timeLimit?: number
	image?: File | null
}

export function useUpdateQuestion() {
	const queryClient = useQueryClient()
	const updateQuestion = useQuestionStore((state) => state.updateQuestion)

	return useMutation({
		mutationFn: async (data: UpdateQuestionPayload) => {
			const { testId, questionId, image, ...updateData } = data

			const formData = new FormData()

			// Add all text fields to formData
			Object.entries(updateData).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					value.forEach((item, index) => {
						formData.append(`${key}[${index}]`, item)
					})
				} else if (value !== undefined) {
					formData.append(key, String(value))
				}
			})

			// Add image if provided
			if (image) {
				formData.append('image', image)
			}

			const response = await api.patch<Question>(`/tests/questions/${questionId}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			return response.data
		},
		onSuccess: (updatedQuestion) => {
			updateQuestion(updatedQuestion)
			queryClient.invalidateQueries({ queryKey: ['questions'] })
			toast.success('Вопрос успешно обновлен')
		},
		onError: (error) => {
			console.error('Failed to update question:', error)
			toast.error('Не удалось обновить вопрос')
		}
	})
} 