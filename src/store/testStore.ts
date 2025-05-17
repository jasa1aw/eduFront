import type { Test } from '@/hooks/useUserTests'
import { create } from 'zustand'

interface TestStore {
	tests: Test[]
	setTests: (tests: Test[]) => void
	addTest: (test: Test) => void
	updateTest: (test: Test) => void
	removeTest: (id: string) => void
}

export const useTestStore = create<TestStore>((set) => ({
	tests: [],
	setTests: (tests) => set({ tests }),
	addTest: (test) => set((state) => ({
		tests: [...state.tests, test]
	})),
	updateTest: (test) => set((state) => ({
		tests: state.tests.map((t) =>
			t.id === test.id ? test : t
		)
	})),
	removeTest: (id) => set((state) => ({
		tests: state.tests.filter((t) => t.id !== id)
	}))
})) 