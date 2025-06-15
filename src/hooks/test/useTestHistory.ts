import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { TestHistoryItem } from "@/types/test"


export const useTestHistory = () => {
	return useQuery<TestHistoryItem[], Error>({
		queryKey: ["test-history"],
		queryFn: async () => {
			const { data } = await api.get<TestHistoryItem[]>("tests/my-tests/history")
			return data
		},
	})
} 