import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { TestHistoryDetail } from "@/types/test"

export const useTestHistoryDetail = (attemptId: string) => {
	return useQuery<TestHistoryDetail, Error>({
		queryKey: ["test-history-detail", attemptId],
		queryFn: async () => {
			const { data } = await api.get<TestHistoryDetail>(`tests/my-tests/history/${attemptId}`)
			return data
		},
		enabled: !!attemptId,
	})
} 