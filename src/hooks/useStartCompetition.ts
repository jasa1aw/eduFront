import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface CompetitionResponse {
	id: string
	testId: string
	startTime: string
	endTime: string
	status: 'CREATED' | 'ACTIVE' | 'COMPLETED'
}

export function useStartCompetition() {
	return useMutation({
		mutationFn: async (testId: string) => {
			const response = await api.post<CompetitionResponse>(`/tests/${testId}/competition`)
			return response.data
		},
		onSuccess: (data) => {
			toast.success('Соревнование успешно начато')
			return data
		},
		onError: (error) => {
			console.error('Failed to start competition:', error)
			toast.error('Не удалось начать соревнование')
		}
	})
} 