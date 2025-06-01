import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

export interface Question {
	id: string
	testId: string
	title: string
	type: string
	options: string[]
	correctAnswers: string[]
	explanation?: string | null
	image?: string | null
	weight?: number | null
}

export interface Test {
	id: string
	title: string
	isDraft: boolean
	creatorId: string
	maxAttempts?: number | null
	timeLimit?: number | null
	showAnswers: boolean
	createdAt: string
	questions: Question[]
}

export const useGameTests = () => {
	return useQuery<Test[], Error>({
		queryKey: ["game-tests"],
		queryFn: async () => {
			const { data } = await api.get<Test[]>("/tests/game-tests")
			return data
		},
	})
} 