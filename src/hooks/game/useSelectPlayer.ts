import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { Competition } from '@/types/competition'

export const useSelectPlayer = () => {
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
				`/games/competitions/${competitionId}/teams/${teamId}/player`,
				{ participantId }
			)
			return response.data
		},
	})
}