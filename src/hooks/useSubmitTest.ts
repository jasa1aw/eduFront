import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Answer } from './useSaveTestProgress'

interface SubmitTestResponse {
	message: string
	score: number
	// The API may not return attemptId, so we don't rely on it
}

export function useSubmitTest() {
	const router = useRouter()

	return useMutation({
		mutationFn: async ({ attemptId, answers }: { attemptId: string; answers: Answer[] }) => {
			const response = await api.post<SubmitTestResponse>(`/tests/${attemptId}/submit`, answers)
			return {
				...response.data,
				attemptId // Include the attemptId in the return data to ensure it's available in onSuccess
			}
		},
		onSuccess: (data, variables) => {
			toast.success(`Тест отправлен! Ваш результат: ${data.score}%`)
			// Use the attemptId from variables as a fallback if it's not in the response
			const attemptId = data.attemptId || variables.attemptId
			router.push(`/test-result/${attemptId}`)
		},
		onError: (error) => {
			console.error('Failed to submit test:', error)
			toast.error('Не удалось отправить тест')
		}
	})
} 