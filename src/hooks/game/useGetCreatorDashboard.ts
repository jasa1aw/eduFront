import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { CreatorDashboardResponse } from '@/types/competition'

export const useGetCreatorDashboard = (competitionId: string) => {
	return useQuery({
		queryKey: ['creatorDashboard', competitionId],
		queryFn: async () => {
			const response = await api.get<CreatorDashboardResponse>(
				`/games/competitions/${competitionId}/creator-dashboard`
			)
			return response.data
		},
		enabled: !!competitionId,
		refetchInterval: 2000, // Обновляем каждые 2 секунды для real-time
	})
}