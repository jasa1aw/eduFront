import api from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTestStore } from "../../store/testStore"
import { Question } from "./useUserTests"

interface CreateTestData {
	title: string
	maxAttempts: number
	timeLimit: number
	examMode: boolean
	isDraft: boolean
	showAnswers: boolean
}

interface CreateTestResponse {
	id: string
	title: string
	maxAttempts: number
	timeLimit: number
	examMode: boolean
	isDraft: boolean
	showAnswers: boolean
	creatorId: string
	createdAt: string
	questions: Question[]
}

export const useCreateTest = () => {
	const queryClient = useQueryClient()
	const addTest = useTestStore((state) => state.addTest)

	return useMutation<CreateTestResponse, Error, CreateTestData>({
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