import { Question, QuestionResult } from "@/types/question"

export interface TestResultResponse {
	testTitle: string
	score: number
	totalQuestions: number
	correctAnswers: number
	incorrectAnswers: number
	showAnswers: boolean
	mode: string
	results: QuestionResult[]
}
export interface TestUser {
	id: string
	title: string
	isDraft: boolean
	creatorId: string
	maxAttempts?: number | null
	timeLimit?: number | null
	showAnswers: boolean
	createdAt: string
	questions: Question[]
	examMode: boolean
}

export interface TestGame {
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

export interface TestHistoryItem {
	attemptId: string
	testId: string
	testTitle: string
	mode: "PRACTICE" | "EXAM"
	status: "COMPLETED" | "IN_PROGRESS" | "FAILED"
	score: number
	startTime: string
	endTime: string | null
	timeLimit: number
	showAnswers: boolean
	duration: number
}

export interface TestHistoryDetail {
	attemptId: string
	testId: string
	testTitle: string
	mode: "PRACTICE" | "EXAM"
	status: "COMPLETED" | "IN_PROGRESS" | "FAILED"
	score: number
	startTime: string
	endTime: string | null
	timeLimit: number
	showAnswers: boolean
	duration: number
}

export interface TestInfo {
	id: string
	title: string
	creatorName: string
	examMode: boolean
	timeLimit: number
	maxAttempts: number
	showAnswers: boolean
	questionsCount: number
}

export interface TestResultRecent {
	test: {
		title: string
		id: string
		_count: {
			attempts: number
			results: number
		}
	}
	score: number
}
