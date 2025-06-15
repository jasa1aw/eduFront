import api from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"

interface ForgotPasswordRequest {
	email: string
}

interface ForgotPasswordResponse {
	message: string
}

export const useForgotPassword = () => {
	return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
		mutationFn: async (data: ForgotPasswordRequest) => {
			const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", data)
			return response.data
		}
	})
} 