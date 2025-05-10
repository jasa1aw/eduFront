import api from "@/lib/axios"
import { useMutation, UseMutationResult } from "@tanstack/react-query"

interface CreateTestData {
	title: string
	maxAttempts: number
	timeLimit: number
	isDraft: boolean
	showAnswers: boolean
}

interface CreateTestResponse {
	id: string
	title: string
	maxAttempts: number
	timeLimit: number
	isDraft: boolean
	showAnswers: boolean
}

type CreateTestMutationResult = UseMutationResult<
	CreateTestResponse,
	Error,
	CreateTestData,
	unknown
>

export const useCreateTest = (): CreateTestMutationResult => {
	return useMutation({
		mutationFn: async (data: CreateTestData) => {
			const response = await api.post<CreateTestResponse>("/tests", data)
			return response.data
		}
	})
} 