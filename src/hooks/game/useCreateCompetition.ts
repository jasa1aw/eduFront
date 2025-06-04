import api from '@/lib/axios'
import { Competition } from '@/types/competition'
import { useMutation } from '@tanstack/react-query'

interface CreateCompetitionDto {
	testId: string
	title?: string
	maxTeams?: number
	userId?: string
}

export const useCreateCompetition = () => {
	return useMutation({
		mutationFn: async (dto: CreateCompetitionDto) => {
			const response = await api.post<Competition>('/games/competitions', dto)
			return response.data
		},
		onError: (error: any) => {
			console.error('Failed to create competition:', error)
		},
	})
}