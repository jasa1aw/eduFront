import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'

export interface ConfirmChangeEmailDto {
	token: string
}

export interface ConfirmChangeEmailResponse {
	success: boolean
	message: string
	user?: {
		id: string
		name: string
		email: string
		role: string
		institution?: string
	}
}

export const useConfirmChangeEmail = () => {
	return useMutation({
		mutationFn: async (data: ConfirmChangeEmailDto) => {
			const response = await api.post<ConfirmChangeEmailResponse>('/auth/change-email/confirm', data)
			return response.data
		}
	})
} 