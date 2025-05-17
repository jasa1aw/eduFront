import api from "@/lib/axios"
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import { useTestStore } from "../store/testStore"

interface CreateTestData {
	title: string
	maxAttempts: number
	isDraft: boolean
	showAnswers: boolean
}

interface CreateTestResponse {
	id: string
	title: string
	maxAttempts: number
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
	const queryClient = useQueryClient()
	const addTest = useTestStore((state) => state.addTest)

	return useMutation({
		mutationFn: async (data: CreateTestData) => {
			const response = await api.post<CreateTestResponse>("/tests", data)
			return response.data
		},
		onSuccess: (data) => {
			addTest(data)
			queryClient.invalidateQueries({ queryKey: ['tests'] })
		}
	})
} 