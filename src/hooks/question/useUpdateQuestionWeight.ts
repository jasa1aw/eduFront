import { Question } from '@/types/question'
import api from '@/lib/axios'
import { useQuestionStore } from '@/store/questionStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { toast } from 'sonner'

interface UpdateWeightPayload {
	questionId: string
	weight: number
}

export function useUpdateQuestionWeight() {
	const queryClient = useQueryClient()
	const updateQuestion = useQuestionStore((state) => state.updateQuestion)
	const questions = useQuestionStore((state) => state.questions)
	const debounceRef = useRef<NodeJS.Timeout>()

	const mutation = useMutation({
		mutationFn: async ({ questionId, weight }: UpdateWeightPayload) => {
			const response = await api.patch<Question>(`/tests/questions/${questionId}`, { weight })
			return response.data
		},
		onSuccess: (updatedQuestion) => {
			// Обновляем стор с актуальными данными с сервера
			updateQuestion(updatedQuestion)
			queryClient.invalidateQueries({ queryKey: ['questions'] })
		},
		onError: (error, variables) => {
			console.error('Failed to update question weight:', error)
			toast.error('Не удалось обновить вес вопроса')

			// Откатываем оптимистичное обновление
			const originalQuestion = questions.find(q => q.id === variables.questionId)
			if (originalQuestion) {
				updateQuestion(originalQuestion)
			}
		}
	})

	const updateWeight = useCallback((questionId: string, newWeight: number) => {
		// Валидация веса
		const clampedWeight = Math.max(50, Math.min(500, newWeight))

		// Оптимистичное обновление UI
		const currentQuestion = questions.find(q => q.id === questionId)
		if (currentQuestion) {
			const optimisticQuestion = { ...currentQuestion, weight: clampedWeight }
			updateQuestion(optimisticQuestion)
		}

		// Очищаем предыдущий debounce
		if (debounceRef.current) {
			clearTimeout(debounceRef.current)
		}

		// Устанавливаем новый debounce для запроса к серверу
		debounceRef.current = setTimeout(() => {
			mutation.mutate({ questionId, weight: clampedWeight })
		}, 500) // 500ms задержка

	}, [questions, updateQuestion, mutation])

	const increaseWeight = useCallback((questionId: string) => {
		const currentQuestion = questions.find(q => q.id === questionId)
		if (currentQuestion) {
			const currentWeight = currentQuestion.weight || 100
			updateWeight(questionId, currentWeight + 50)
		}
	}, [questions, updateWeight])

	const decreaseWeight = useCallback((questionId: string) => {
		const currentQuestion = questions.find(q => q.id === questionId)
		if (currentQuestion) {
			const currentWeight = currentQuestion.weight || 100
			updateWeight(questionId, currentWeight - 50)
		}
	}, [questions, updateWeight])

	return {
		updateWeight,
		increaseWeight,
		decreaseWeight,
		isUpdating: mutation.isPending
	}
} 