import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useSubmitPracticeTest() {
	const router = useRouter()
	return useMutation({
		mutationFn: async ({ attemptId}: { attemptId: string }) => {
			const response = await api.post(`/tests/${attemptId}/submit-practice`)
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