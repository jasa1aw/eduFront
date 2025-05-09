import { useAuthStore } from '@/store/auth/authStore'

export const useAuth = () => {
	const { user, isAuthenticated, setUser, setIsAuthenticated, logout } = useAuthStore()

	return {
		user,
		isAuthenticated,
		setUser,
		setIsAuthenticated,
		logout
	}
} 