import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'

interface SubmitAnswerDto {
	participantId: string
	questionId: string
	selectedAnswers?: string[]
	userAnswer?: string
}

interface SubmitAnswerResponse {
	isCorrect: boolean
	score: number
	nextQuestionId: string | null
	isTestCompleted: boolean
}

export const useSubmitAnswer = () => {
	return useMutation({
		mutationFn: async ({
			competitionId,
			...dto
		}: {
			competitionId: string
		} & SubmitAnswerDto) => {
			const response = await api.post<SubmitAnswerResponse>(
				`/games/competitions/${competitionId}/answer`,
				dto
			)
			return response.data
		},
	})
}