import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

export interface PendingAnswer {
	answerId: string
	attemptId: string
	questionId: string
	questionTitle: string
	userAnswer: string
	studentName: string
	studentEmail: string
	submittedAt: string
	startedAt: string
}

export interface PendingTest {
	testId: string
	testTitle: string
	pendingCount: number
	answers: PendingAnswer[]
}

export const usePendingAnswers = () => {
	return useQuery<PendingTest[], Error>({
		queryKey: ["pending-answers"],
		queryFn: async () => {
			const { data } = await api.get<PendingTest[]>("tests/pending")
			return data
		},
	})
}