import api from "@/lib/axios"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuestionStore } from '@/store/questionStore'
import { Question } from '@/types/question'

export const useDeleteQuestion = () => {
	const queryClient = useQueryClient()
	const removeQuestion = useQuestionStore((state) => state.removeQuestion)

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await api.delete<Question>(`tests/questions/${id}`)
			return response.data
		},
		onSuccess: (_, id) => {
			removeQuestion(id)
			queryClient.invalidateQueries({ queryKey: ['questions'] })
		},
	})
} 