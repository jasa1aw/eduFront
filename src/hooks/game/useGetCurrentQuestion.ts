import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { Question } from '@/types/competition'

export const useGetCurrentQuestion = (competitionId: string, participantId: string) => {
	return useQuery({
		queryKey: ['currentQuestion', competitionId, participantId],
		queryFn: async () => {
			const response = await api.get<Question>(
				`/games/competitions/${competitionId}/question?participantId=${participantId}`
			)
			return response.data
		},
		enabled: !!(competitionId && participantId),
	})
}