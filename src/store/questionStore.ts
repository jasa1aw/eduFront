import type { Question as ApiQuestion } from '@/hooks/useUserTests'
import { create } from 'zustand'

interface QuestionStore {
	questions: ApiQuestion[]
	setQuestions: (questions: ApiQuestion[]) => void
	addQuestion: (question: ApiQuestion) => void
	updateQuestion: (question: ApiQuestion) => void
	removeQuestion: (id: string) => void
}

export const useQuestionStore = create<QuestionStore>((set) => ({
	questions: [],
	setQuestions: (questions) => set({ questions }),
	addQuestion: (question) => set((state) => ({
		questions: [...state.questions, question]
	})),
	updateQuestion: (question) => set((state) => ({
		questions: state.questions.map((q) =>
			q.id === question.id ? question : q
		)
	})),
	removeQuestion: (id) => set((state) => ({
		questions: state.questions.filter((q) => q.id !== id)
	}))
})) 