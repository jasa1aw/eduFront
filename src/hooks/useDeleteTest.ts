import api from "@/lib/axios"
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
		},
	})
} 