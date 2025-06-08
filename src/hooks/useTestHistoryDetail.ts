import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

export interface TestHistoryDetail {
	attemptId: string
	testId: string
	testTitle: string
	mode: "PRACTICE" | "EXAM"
	status: "COMPLETED" | "IN_PROGRESS" | "FAILED"
	score: number
	startTime: string
	endTime: string | null
	timeLimit: number
	showAnswers: boolean
	duration: number
}

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