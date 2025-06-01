import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { LeaderboardResponse } from '@/types/competition'

export const useGetLeaderboard = (competitionId: string) => {
	return useQuery({
		queryKey: ['leaderboard', competitionId],
		queryFn: async () => {
			const response = await api.get<LeaderboardResponse>(`/games/competitions/${competitionId}/leaderboard`)
			return response.data
		},
		enabled: !!competitionId,
		refetchInterval: 3000, // Обновляем каждые 3 секунды
	})
}