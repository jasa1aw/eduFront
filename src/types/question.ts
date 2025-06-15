
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
export interface QuestionResult {
	questionId: string
	questionTitle: string
	questionType: string
	options: string[]
	correctAnswers: string[]
	userSelectedAnswers: string[]
	userAnswer: string | null
	isCorrect: boolean | null
	explanation: string | null
}