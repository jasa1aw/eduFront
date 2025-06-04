import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { Competition } from '@/types/competition'

export const useGetCompetition = (competitionId: string, userId?: string) => {
	return useQuery({
		queryKey: ['competition', competitionId, userId],
		queryFn: async () => {
			const params = userId ? `?userId=${userId}` : ''
			const response = await api.get<Competition>(`/games/competitions/${competitionId}${params}`)
			return response.data
		},
		enabled: !!competitionId,
		refetchInterval: 5000, // Обновляем каждые 5 секунд
	})
}