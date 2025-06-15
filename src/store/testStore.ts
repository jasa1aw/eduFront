import { TestUser } from '@/types/test'
import { create } from 'zustand'

interface TestStore {
	tests: TestUser[]
	setTests: (tests: TestUser[]) => void
	addTest: (test: TestUser) => void
	updateTest: (test: TestUser) => void
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