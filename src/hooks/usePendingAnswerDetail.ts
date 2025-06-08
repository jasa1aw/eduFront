import api from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface StudentInfo {
	id: string
	name: string
	email: string
}

export interface AttemptStatistics {
	totalQuestions: number
	correctAnswers: number
	incorrectAnswers: number
	pendingAnswers: number
}

export interface AttemptInfo {
	startTime: string
	endTime: string
	currentScore: number
	statistics: AttemptStatistics
}

export interface QuestionAnswer {
	questionId: string
	questionTitle: string
	questionType: string
	questionWeight: number
	options: any[]
	correctAnswers: any[]
	userSelectedAnswers: any[]
	userAnswer: string
	isCorrect: boolean | null
	status: string
	isPendingReview: boolean
}

export interface PendingAnswerDetail {
	answerId: string
	attemptId: string
	testId: string
	testTitle: string
	questionId: string
	questionTitle: string
	questionWeight: number
	userAnswer: string
	status: string
	student: StudentInfo
	attemptInfo: AttemptInfo
	allAnswers: QuestionAnswer[]
}

export const usePendingAnswerDetail = (answerId: string) => {
	return useQuery<PendingAnswerDetail, Error>({
		queryKey: ["pending-answer-detail", answerId],
		queryFn: async () => {
			const { data } = await api.get<PendingAnswerDetail>(`/tests/pending/${answerId}`)
			return data
		},
		enabled: !!answerId,
	})
}

interface GradeAnswerResponse {
	id: string
	attemptId: string
	userId: string
	testId: string
	score: number
}

interface RecalculateScoreResponse {
	id: string
	attemptId: string
	userId: string
	testId: string
	score: number
}

export const useGradeAnswer = () => {
	const queryClient = useQueryClient()

	return useMutation<GradeAnswerResponse, Error, { answerId: string; isCorrect: boolean }>({
		mutationFn: async ({ answerId, isCorrect }) => {
			const { data } = await api.patch<GradeAnswerResponse>(`/tests/review-answer/${answerId}`, {
				isCorrect
			})
			return data
		},
		onSuccess: (data, variables) => {
			console.log('Успешная оценка ответа:', data)
			queryClient.invalidateQueries({ queryKey: ["pending-answer-detail", variables.answerId] })
			queryClient.invalidateQueries({ queryKey: ["pending-answers"] })
		},
		onError: (error) => {
			console.error('Ошибка при оценке ответа:', error)
		}
	})
}

export const useRecalculateScore = () => {
	const queryClient = useQueryClient()

	return useMutation<RecalculateScoreResponse, Error, string>({
		mutationFn: async (attemptId: string) => {
			const { data } = await api.patch<RecalculateScoreResponse>(`/tests/${attemptId}/recalculate-score`)
			return data
		},
		onSuccess: (data, attemptId) => {
			queryClient.invalidateQueries({ queryKey: ["pending-answer-detail"] })
			queryClient.invalidateQueries({ queryKey: ["pending-answers"] })
		},
	})
} 