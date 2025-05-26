import api from '@/lib/axios'
import { deleteCookie, getCookie, setCookie } from '@/lib/cookies'
import { create } from 'zustand'

export interface User {
	id: string
	name: string
	email: string
	role: string
}

interface AuthError {
	message: string
	code?: string
}

interface AuthState {
	// User state
	user: User | null
	email: string
	isAuthenticated: boolean

	// Loading states
	isLoading: boolean

	// Error state
	error: AuthError | null

	// Actions
	setUser: (user: User | null) => void
	setEmail: (email: string) => void
	setIsAuthenticated: (isAuthenticated: boolean) => void
	setIsLoading: (isLoading: boolean) => void
	setError: (error: AuthError | null) => void
	setToken: (token: string) => void

	logout: () => Promise<void>
	fetchUser: () => Promise<void>
}

// Token management
const checkAuthToken = () => {
	if (typeof window !== 'undefined') {
		return getCookie('token') !== null || localStorage.getItem('token') !== null
	}
	return false
}

export const useAuthStore = create<AuthState>((set) => ({
	// Initial state
	user: null,
	email: '',
	isAuthenticated: checkAuthToken(),
	isLoading: false,
	error: null,

	// State setters
	setUser: (user) => set({ user, isAuthenticated: !!user }),
	setEmail: (email) => set({ email }),
	setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
	setIsLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),
	setToken: (token) => {
		// Сохраняем токен и в cookies, и в localStorage для совместимости
		setCookie('token', token, 7) // 7 дней
		if (typeof window !== 'undefined') {
			localStorage.setItem('token', token)
		}
		set({ isAuthenticated: true })
	},

	logout: async () => {
		try {
			await api.post('/auth/logout')
			// Удаляем токен из cookies и localStorage
			deleteCookie('token')
			if (typeof window !== 'undefined') {
				localStorage.removeItem('token')
			}
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			})
			window.location.href = '/sign-in'
		} catch (error: any) {
			set({
				error: {
					message: error.response?.data?.message || 'Logout failed',
					code: error.response?.status?.toString(),
				},
			})
		}
	},

	fetchUser: async () => {
		set({ isLoading: true, error: null })
		try {
			const response = await api.get<User>('auth/me')
			set({
				user: response.data,
				isAuthenticated: true,
				isLoading: false,
			})
		} catch (error: any) {
			set({
				error: {
					message: error.response?.data?.message || 'Failed to fetch user',
					code: error.response?.status?.toString(),
				},
				user: null,
				isAuthenticated: false,
				isLoading: false,
			})
			// Если не удалось получить пользователя, удаляем токен
			deleteCookie('token')
			if (typeof window !== 'undefined') {
				localStorage.removeItem('token')
			}
		}
	},
}))