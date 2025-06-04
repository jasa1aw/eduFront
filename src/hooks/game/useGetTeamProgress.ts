import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

interface TeamProgress {
	teamId: string
	teamName: string
	totalQuestions: number
	answeredQuestions: number
	correctAnswers: number
	totalScore: number
	isCompleted: boolean
	progress: number
}

export const useGetTeamProgress = (competitionId: string, participantId: string) => {
	return useQuery({
		queryKey: ['teamProgress', competitionId, participantId],
		queryFn: async () => {
			const response = await api.get<TeamProgress>(
				`/games/competitions/${competitionId}/progress?participantId=${participantId}`
			)
			return response.data
		},
		enabled: !!(competitionId && participantId),
		refetchInterval: 5000,
	})
}