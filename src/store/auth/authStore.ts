import { create } from 'zustand'

interface User {
	id: string
	name: string
	email: string
	role: string
}

interface AuthStore {
	user: User | null
	isAuthenticated: boolean
	setUser: (user: User | null) => void
	setIsAuthenticated: (isAuthenticated: boolean) => void
	logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	isAuthenticated: false,
	setUser: (user) => set({ user }),
	setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
	logout: () => set({ user: null, isAuthenticated: false }),
})) 