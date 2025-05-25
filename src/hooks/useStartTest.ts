import api from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export interface StartTestResponse {
	attemptId: string
	mode: "PRACTICE" | "EXAM"
	firstQuestionId: string
}

export function useStartTest() {
	const router = useRouter()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (testId: string) => {
			const response = await api.post<StartTestResponse>(`/tests/${testId}/start-practice `)
			return response.data
		},
		onSuccess: (data) => {
			// Store the attempt data in the query cache
			queryClient.setQueryData(['test-attempt', data.attemptId], data)
			toast.success('Тест начат')

			// Navigate to the test-taking page with the attempt ID
			router.push(`/test-attempt/${data.attemptId}`)
		},
		onError: (error) => {
			console.error('Failed to start test:', error)
			toast.error('Не удалось начать тест')
		}
	})
} 