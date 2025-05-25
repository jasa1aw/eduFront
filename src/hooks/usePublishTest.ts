import { Test } from '@/hooks/useUserTests'
import api from '@/lib/axios'
import { useQuestionStore } from '@/store/questionStore'
import { useTestStore } from '@/store/testStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function usePublishTest() {
	const queryClient = useQueryClient()
	const updateTest = useTestStore((state) => state.updateTest)
	const questions = useQuestionStore((state) => state.questions)

	return useMutation({
		mutationFn: async (testId: string) => {
			// Client-side validation to check if the test has at least one question
			if (questions.length === 0) {
				throw new Error('Для публикации теста нужен минимум 1 вопрос')
			}

			const response = await api.patch<Test>(`/tests/${testId}`, {
				isDraft: false
			})

			return response.data
		},
		onSuccess: (publishedTest) => {
			updateTest(publishedTest)
			queryClient.invalidateQueries({ queryKey: ['tests'] })
			queryClient.invalidateQueries({ queryKey: ['test', publishedTest.id] })
			toast.success('Тест успешно опубликован')
		},
		onError: (error: Error) => {
			console.error('Failed to publish test:', error)
			toast.error(error.message || 'Не удалось опубликовать тест')
		}
	})
} 