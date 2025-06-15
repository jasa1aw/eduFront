import api from "@/lib/axios"
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface GenerateTestLinkRequest {
	testId: string
}

interface GenerateTestLinkResponse {
	testId: string
	testTitle: string
	link: string
	token: string
	createdAt: string
}

export const useGenerateTestLink = () => {
	return useMutation({
		mutationFn: async (data: GenerateTestLinkRequest): Promise<GenerateTestLinkResponse> => {
			const response = await api.post<GenerateTestLinkResponse>('/tests/generate-link', data)
			return response.data
		},
		onSuccess: () => {
			toast.success('Ссылка на тест успешно создана')
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || 'Не удалось создать ссылку на тест'
			toast.error(errorMessage)
		}
	})
} 