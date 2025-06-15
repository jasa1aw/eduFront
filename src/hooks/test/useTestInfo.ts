import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { TestInfo } from "@/types/test"

export const useTestInfo = (testId: string) => {
	return useQuery<TestInfo, Error>({
		queryKey: ["test-info", testId],
		queryFn: async () => {
			const { data } = await api.get<TestInfo>(`/tests/test-info/${testId}`)
			return data
		},
		enabled: !!testId,
	})
} 