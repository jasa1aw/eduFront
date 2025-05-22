import { Test } from '@/hooks/useUserTests'
import api from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export interface StartTestResponse {
	attemptId: string
	test: Test
}

export function useStartTest() {
	const router = useRouter()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (testId: string) => {
			const response = await api.post<StartTestResponse>(`/tests/${testId}/start`)
			return response.data
		},
		onSuccess: (data) => {
			// Store the test data in the query cache so we don't need to fetch it again
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