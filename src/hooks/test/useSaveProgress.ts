import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'

export interface PracticeAnswerRequest {
	questionId: string
	selectedAnswers?: string[]
	userAnswer?: string
}

export interface SaveProgressResponse {
	success: boolean
	message: string
	nextQuestionId: string | null
	isCompleted: boolean
}

export function useSaveProgress() {
	return useMutation<SaveProgressResponse, Error, { attemptId: string; answer: PracticeAnswerRequest }>({
		mutationFn: async ({ attemptId, answer }: { attemptId: string; answer: PracticeAnswerRequest }) => {
			const { data } = await api.post<SaveProgressResponse>(`/tests/${attemptId}/progress`, { answer })
			return data
		}
	})
} 