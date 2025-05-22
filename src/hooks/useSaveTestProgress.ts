import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface Answer {
	questionId: string
	selectedAnswers?: string[]
	userAnswer?: string
}

export function useSaveTestProgress() {
	return useMutation({
		mutationFn: async ({ attemptId, answers }: { attemptId: string; answers: Answer[] }) => {
			const response = await api.post(`/tests/${attemptId}/progress`, answers)
			return response.data
		},
		onSuccess: () => {
			toast.success('Прогресс сохранен', { duration: 2000 })
		},
		onError: (error) => {
			console.error('Failed to save test progress:', error)
			toast.error('Не удалось сохранить прогресс')
		}
	})
} 