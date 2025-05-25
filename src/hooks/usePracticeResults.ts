import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

export function usePracticeResults(attemptId: string) {
	return useQuery({
		queryKey: ['practice-results', attemptId],
		queryFn: async () => {
			const { data } = await api.get(`/tests/${attemptId}/practice-results`)
			return data
		},
		enabled: !!attemptId
	})
} 