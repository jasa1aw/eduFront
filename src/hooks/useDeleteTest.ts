import api from "@/lib/axios"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTestStore } from '../store/testStore'
import type { Test } from './useUserTests'

export const useDeleteTest = () => {
	const queryClient = useQueryClient()
	const removeTest = useTestStore((state) => state.removeTest)

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await api.delete<Test>(`/tests/${id}`)
			return response.data
		},
		onSuccess: (_, id) => {
			removeTest(id)
			queryClient.invalidateQueries({ queryKey: ['tests'] })
			toast.success('Тест успешно удален')
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Не удалось удалить тест')
		},
	})
} 