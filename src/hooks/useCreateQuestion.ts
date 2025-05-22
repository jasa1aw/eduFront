import { QuestionType } from '@/components/ui/QuestionTypeStep'
import api from "@/lib/axios"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuestionStore } from '../store/questionStore'

export interface CreateQuestionPayload {
	image?: File | null
	weight: number
	timeLimit: number
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
	timeLimit: number
	type: QuestionType
	title: string
	options: string[]
	correctAnswers: string[]
	explanation?: string
	// createdAt: string
	// updatedAt: string
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

	// const hasCorrectAnswer = data.answers.some(answer => answer.correct)
	// if (!hasCorrectAnswer) {
	// 	return 'Должен быть выбран хотя бы один правильный ответ'
	// }

	return null
}

const prepareQuestionData = (data: CreateQuestionPayload): FormData => {
	const formData = new FormData()

	if (data.image) formData.append('image', data.image)
	formData.append('weight', String(data.weight))
	formData.append('timeLimit', String(data.timeLimit))
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
			options.push('true', 'false')
			data.answers.forEach(answer => {
				if (answer.correct) {
					correctAnswers.push(answer.text.toLowerCase())
				}
			})
			break

		// case 'SHORT_ANSWER':
		// case 'OPEN_QUESTION':
		// 	// Для короткого и открытого ответа только правильные ответы
		// 	data.answers.forEach(answer => {
		// 		if (answer.correct) {
		// 			correctAnswers.push(answer.text)
		// 		}
		// 	})
		// 	break
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

export function useCreateQuestion(testId: string) {
	const queryClient = useQueryClient()
	const addQuestion = useQuestionStore((state) => state.addQuestion)

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
			queryClient.invalidateQueries({ queryKey: ['questions'] })
		}
	})
} 