import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

export interface QuestionAttempt {
	id: string
	title: string
	image?: string | null
	explanation?: string | null
	type: "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "OPEN_QUESTION" | "TRUE_FALSE"
	options: string[]
	weight: number
}

export const useGetQsAttempt = (attemptId: string, questionId: string) => {
	return useQuery<QuestionAttempt, Error>({
		queryKey: ["question-attempt", attemptId, questionId],
		queryFn: async () => {
			const { data } = await api.get<QuestionAttempt>(`tests/${attemptId}/question/${questionId}`)
			return data
		},
		enabled: !!attemptId && !!questionId,
	})
}
