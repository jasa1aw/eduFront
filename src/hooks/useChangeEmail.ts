import api from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface ChangeEmailDto {
	newEmail: string
}

export interface ChangeEmailResponse {
	message: string
}

export const useChangeEmail = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: ChangeEmailDto) => {
			const response = await api.post<ChangeEmailResponse>('/auth/change-email', data)
			return response.data
		},
		onSuccess: (data) => {
			toast.success(data.message || 'Ссылка для подтверждения отправлена на новый email')
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || 'Не удалось изменить email'
			toast.error(errorMessage)
		}
	})
} 