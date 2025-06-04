import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { Competition } from '@/types/competition'

export const useSelectTeam = () => {
	return useMutation({
		mutationFn: async ({
			competitionId,
			teamId,
			participantId
		}: {
			competitionId: string
			teamId: string
			participantId: string
		}) => {
			const response = await api.post<Competition>(
				`/games/competitions/${competitionId}/teams/${teamId}/select`,
				{ participantId }
			)
			return response.data
		},
	})
}