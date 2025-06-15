import { TestUser } from '@/types/test'
import api from '@/lib/axios'
import { useQuestionStore } from '@/store/questionStore'
import { useTestStore } from '@/store/testStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface UpdateTestPayload {
	testId: string
	title?: string
	isDraft?: boolean
	maxAttempts?: number
	showAnswers?: boolean
	timeLimit?: number
	examMode?: boolean
}

export function useUpdateTest() {
	const queryClient = useQueryClient()
	const updateTest = useTestStore((state) => state.updateTest)
	const { setQuestions } = useQuestionStore()

	return useMutation({
		mutationFn: async (data: UpdateTestPayload) => {
			const { testId, ...updateData } = data
			const response = await api.patch<TestUser>(`/tests/${testId}`, updateData)
			return response.data
		},
		onSuccess: (updatedTest) => {
			updateTest(updatedTest)
			// Обновляем стор вопросов, если в ответе есть вопросы
			if (updatedTest.questions) {
				setQuestions(updatedTest.questions)
			}
			queryClient.invalidateQueries({ queryKey: ['tests'] })
			queryClient.invalidateQueries({ queryKey: ['test', updatedTest.id] })
			toast.success('Тест успешно обновлен')
		},
		onError: (error) => {
			console.error('Failed to update test:', error)
			toast.error('Не удалось обновить тест')
		}
	})
} 