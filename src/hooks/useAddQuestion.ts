import { QuestionType } from '@/components/ui/QuestionTypeStep'
import api from "@/lib/axios"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuestionStore } from '../store/questionStore'
import { useTestStore } from '../store/testStore'

export interface CreateQuestionPayload {
	image?: File | null
	weight: number
	type: QuestionType
	title: string
	answers: { text: string; correct: boolean }[]
	explanation?: string
}

export interface QuestionResponse {
	id: string
	testId: string
	image?: string
	weight: number
	type: QuestionType
	title: string
	options: string[]
	correctAnswers: string[]
	explanation?: string
}

const validatePayload = (data: CreateQuestionPayload): string | null => {
	if (!data.title.trim()) {
		return 'Заголовок вопроса не может быть пустым'
	}

	if (data.type === 'MULTIPLE_CHOICE' && data.answers.length < 2) {
		return 'Для вопроса с множественным выбором нужно минимум 2 варианта ответа'
	}

	if (data.type === 'TRUE_FALSE' && data.answers.length !== 2) {
		return 'Для вопроса типа "Правда или ложь" должно быть ровно 2 варианта ответа'
	}

	return null
}

const prepareQuestionData = (data: CreateQuestionPayload): FormData => {
	const formData = new FormData()

	if (data.image) formData.append('image', data.image)
	formData.append('weight', String(data.weight))
	formData.append('type', data.type)
	formData.append('title', data.title)

	if (data.explanation) {
		formData.append('explanation', data.explanation)
	}

	// Подготовка options и correctAnswers в зависимости от типа вопроса
	const options: string[] = []
	const correctAnswers: string[] = []

	switch (data.type) {
		case 'MULTIPLE_CHOICE':
			// Для множественного выбора все ответы идут в options
			data.answers.forEach(answer => {
				options.push(answer.text)
				if (answer.correct) {
					correctAnswers.push(answer.text)
				}
			})
			break

		case 'TRUE_FALSE':
			// Для true/false используем фиксированные значения
			options.push('правда', 'ложь')
			data.answers.forEach(answer => {
				if (answer.correct) {
					correctAnswers.push(answer.text.toLowerCase())
				}
			})
			break
	}

	// Добавляем options и correctAnswers в formData
	options.forEach((option, index) => {
		formData.append(`options[${index}]`, option)
	})

	correctAnswers.forEach((answer, index) => {
		formData.append(`correctAnswers[${index}]`, answer)
	})

	return formData
}

export function useAddQuestion(testId: string) {
	const queryClient = useQueryClient()
	const addQuestion = useQuestionStore((state) => state.addQuestion)
	const tests = useTestStore((state) => state.tests)
	const updateTest = useTestStore((state) => state.updateTest)

	return useMutation<QuestionResponse, Error, CreateQuestionPayload>({
		mutationFn: async (data: CreateQuestionPayload) => {
			const validationError = validatePayload(data)
			if (validationError) {
				throw new Error(validationError)
			}

			try {
				const formData = prepareQuestionData(data)
				const res = await api.post<QuestionResponse>(`/tests/${testId}/questions`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
				return res.data
			} catch (error) {
				if (error instanceof Error) {
					throw new Error(`Ошибка при создании вопроса: ${error.message}`)
				}
				throw new Error('Неизвестная ошибка при создании вопроса')
			}
		},
		onSuccess: (data) => {
			addQuestion(data)

			// Обновляем стор теста, добавляя новый вопрос
			const currentTest = tests.find(test => test.id === testId)
			if (currentTest) {
				const updatedTest = {
					...currentTest,
					questions: [...(currentTest.questions || []), data]
				}
				updateTest(updatedTest)
			}

			queryClient.invalidateQueries({ queryKey: ['questions'] })
			queryClient.invalidateQueries({ queryKey: ['test', testId] })
		}
	})
} 