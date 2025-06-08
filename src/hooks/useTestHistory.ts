import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

export interface TestHistoryItem {
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

export const useTestHistory = () => {
	return useQuery<TestHistoryItem[], Error>({
		queryKey: ["test-history"],
		queryFn: async () => {
			const { data } = await api.get<TestHistoryItem[]>("tests/my-tests/history")
			return data
		},
	})
} 