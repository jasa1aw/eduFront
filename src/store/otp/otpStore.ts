import { create } from 'zustand'

interface OTPStore {
	isOTPModalOpen: boolean
	email: string
	setOTPModalOpen: (isOpen: boolean) => void
	setEmail: (email: string) => void
	resetOTPStore: () => void
}

export const useOTPStore = create<OTPStore>((set) => ({
	isOTPModalOpen: false,
	email: '',
	setOTPModalOpen: (isOpen) => set({ isOTPModalOpen: isOpen }),
	setEmail: (email) => set({ email }),
	resetOTPStore: () => set({ isOTPModalOpen: false, email: '' }),
})) 