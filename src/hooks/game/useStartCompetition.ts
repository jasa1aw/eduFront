import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { Competition } from '@/types/competition'

export const useStartCompetition = () => {
	return useMutation({
		mutationFn: async (competitionId: string) => {
			const response = await api.post<Competition>(`/games/competitions/${competitionId}/start`)
			return response.data
		},
	})
}