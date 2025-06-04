import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { Competition } from '@/types/competition'

interface JoinCompetitionDto {
	code: string
	displayName: string
}

interface JoinCompetitionResponse {
	competition: Competition
	participantId: string
}

export const useJoinCompetition = () => {
	return useMutation({
		mutationFn: async (dto: JoinCompetitionDto) => {
			const response = await api.post<JoinCompetitionResponse>('/games/competitions/join', dto)
			return response.data
		},
	})
}