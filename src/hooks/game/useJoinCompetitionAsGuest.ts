import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { Competition } from '@/types/competition'

interface JoinCompetitionAsGuestDto {
	code: string
	displayName: string
}

interface JoinCompetitionResponse {
	competition: Competition
	participantId: string
}

export const useJoinCompetitionAsGuest = () => {
	return useMutation({
		mutationFn: async (dto: JoinCompetitionAsGuestDto) => {
			const response = await api.post<JoinCompetitionResponse>('/games/competitions/join-guest', dto)
			return response.data
		},
	})
}