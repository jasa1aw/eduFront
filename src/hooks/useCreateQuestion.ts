import api from "@/lib/axios"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuestionStore } from '../store/questionStore'

export interface CreateQuestionPayload {
	image?: File | null
	weight: number
	timeLimit: number
	type: string
	title: string
	answers: { text: string; correct: boolean }[]
}

export function useCreateQuestion(testId: string) {
	const queryClient = useQueryClient()
	const addQuestion = useQuestionStore((state) => state.addQuestion)

	return useMutation({
		mutationFn: async (data: CreateQuestionPayload) => {
			const formData = new FormData()
			// console.log('[useCreateQuestion] data.image:', data.image, data.image instanceof File)
			if (data.image) formData.append('image', data.image)
			// formData.append('image', data.image)
			console.log('[useCreateQuestion] formData.get("image"):', formData.get('image'), formData.get('image') instanceof File)
			formData.append('weight', String(data.weight))
			if (data.timeLimit) formData.append('timeLimit', String(data.timeLimit))
			formData.append('type', data.type)
			formData.append('title', data.title)
			if (data.answers) formData.append('answers', JSON.stringify(data.answers))
			console.log('[useCreateQuestion] formData:', formData)
			const res = await api.post(`/tests/${testId}/questions`, formData)
			return res.data
		},
		onSuccess: (data) => {
			addQuestion(data)
			queryClient.invalidateQueries({ queryKey: ['questions'] })
		}
	})
} 