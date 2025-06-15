import api from '@/lib/axios'
import { useAuthStore } from '@/store/auth/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface UpdateProfileDto {
	name?: string
	institution?: string
}

export interface UpdateProfileResponse {
	name: string
	email: string
	institution?: string
}

export const useUpdateProfile = () => {
	const queryClient = useQueryClient()
	const { user, setUser } = useAuthStore()

	return useMutation({
		mutationFn: async (data: UpdateProfileDto) => {
			const response = await api.patch<UpdateProfileResponse>('/auth/profile', data)
			return response.data
		},
		onSuccess: (updatedData) => {
			// Обновляем локальный стор
			if (user) {
				setUser({
					...user,
					name: updatedData.name,
					institution: updatedData.institution || user.institution
				})
			}

			// Инвалидируем кеш
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })

			toast.success('Профиль успешно обновлен')
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || 'Не удалось обновить профиль'
			toast.error(errorMessage)
		}
	})
} 