import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

export interface TestInfo {
	id: string
	title: string
	creatorName: string
	examMode: boolean
	timeLimit: number
	maxAttempts: number
	showAnswers: boolean
	questionsCount: number
}

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