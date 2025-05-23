import { Test } from '@/hooks/useUserTests'
import api from '@/lib/axios'
import { useTestStore } from '@/store/testStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface UpdateTestPayload {
	testId: string
	title?: string
	isDraft?: boolean
	maxAttempts?: number
	showAnswers?: boolean
}

export function useUpdateTest() {
	const queryClient = useQueryClient()
	const updateTest = useTestStore((state) => state.updateTest)

	return useMutation({
		mutationFn: async (data: UpdateTestPayload) => {
			const { testId, ...updateData } = data
			const response = await api.patch<Test>(`/tests/${testId}`, updateData)
			return response.data
		},
		onSuccess: (updatedTest) => {
			updateTest(updatedTest)
			queryClient.invalidateQueries({ queryKey: ['tests'] })
			toast.success('Тест успешно обновлен')
		},
		onError: (error) => {
			console.error('Failed to update test:', error)
			toast.error('Не удалось обновить тест')
		}
	})
} 