import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { TeamChatResponse } from '@/types/competition'

export const useGetTeamChat = (
	competitionId: string,
	teamId: string,
	participantId: string
) => {
	return useQuery({
		queryKey: ['teamChat', competitionId, teamId, participantId],
		queryFn: async () => {
			const response = await api.get<TeamChatResponse>(
				`/games/competitions/${competitionId}/teams/${teamId}/chat-full?participantId=${participantId}`
			)
			return response.data
		},
		enabled: !!(competitionId && teamId && participantId),
	})
}