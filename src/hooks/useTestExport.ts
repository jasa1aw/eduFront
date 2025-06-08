import api from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"

export const useTestExport = (testId: string) => {
	const exportWithAnswers = useMutation<Blob>({
		mutationFn: async () => {
			const response = await api.get(`/tests/${testId}/export-with-answers`, {
				responseType: 'blob'
			})
			return response.data
		}
	})

	const exportWithoutAnswers = useMutation<Blob>({
		mutationFn: async () => {
			const response = await api.get(`/tests/${testId}/export`, {
				responseType: 'blob'
			})
			return response.data
		}
	})
	
	

	return {
		exportWithAnswers,
		exportWithoutAnswers,
	}
} 
export const useAttepmtExport = (attemptId: string | null) => {
	const exportAttempt = useMutation<Blob>({
		mutationFn: async () => {
			const response = await api.get(`/tests/${attemptId}/export-attempt`, {
				responseType: 'blob'
			})
			return response.data
		}
	})
	return {
		exportAttempt
	}
}