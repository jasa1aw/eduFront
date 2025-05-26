import api from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"

interface ResetPasswordRequest {
	email: string
	token: string
	newPassword: string
}

interface ResetPasswordResponse {
	message: string
}

export const useResetPassword = () => {
	return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
		mutationFn: async (data: ResetPasswordRequest) => {
			const response = await api.post<ResetPasswordResponse>("/auth/reset-password", data)
			return response.data
		}
	})
} 