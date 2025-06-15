'use client'

import React, { useCallback, useEffect, useState } from "react"
import { useAddQuestion } from '@/hooks/question/useAddQuestion'
import { useUpdateQuestion } from '@/hooks/question/useUpdateQuestion'
import { Question } from '@/types/question'
import QuestionFormStep from "./QuestionFormStep"
import QuestionTypeStep, { QuestionType } from "./QuestionTypeStep"

interface Answer {
	text: string
	correct: boolean
}

interface QuestionModalProps {
	isOpen: boolean
	onClose: () => void
	testId: string
	editQuestion?: Question | null
}

interface QuestionState {
	step: 1 | 2
	type?: QuestionType
	image: File | null
	weight: number
	title: string
	answers: Answer[]
	explanation?: string
}

const INITIAL_STATE: QuestionState = {
	step: 1,
	type: undefined,
	image: null,
	weight: 100,
	title: '',
	answers: [],
	explanation: '',
}

const getDefaultAnswers = (type: QuestionType): Answer[] => {
	switch (type) {
		case 'MULTIPLE_CHOICE':
			return Array(4).fill(0).map(() => ({ text: '', correct: false }))
		case 'TRUE_FALSE':
			return [
				{ text: 'Дұрыс', correct: false },
				{ text: 'Бұрыс', correct: false },
			]
		case 'SHORT_ANSWER':
		case 'OPEN_QUESTION':
			return [{ text: '', correct: false }]
		default:
			return []
	}
}

// Функция для преобразования Question в QuestionState
const questionToState = (question: Question): QuestionState => {
	// Преобразуем options и correctAnswers в формат Answer[]
	const answers: Answer[] = []

	if (question.type === 'TRUE_FALSE') {
		answers.push(
			{ text: 'Дұрыс', correct: question.correctAnswers.includes('Дұрыс') },
			{ text: 'Бұрыс', correct: question.correctAnswers.includes('Бұрыс') }
		)
	} else if (question.type === 'SHORT_ANSWER' || question.type === 'OPEN_QUESTION') {
		answers.push({ text: question.correctAnswers[0] || '', correct: true })
	} else if (question.type === 'MULTIPLE_CHOICE') {
		question.options.forEach((option: string) => {
			answers.push({
				text: option,
				correct: question.correctAnswers.includes(option)
			})
		})
	}

	return {
		step: 2, // Сразу переходим к форме при редактировании
		type: question.type as QuestionType,
		image: null, // Изображение будет загружено отдельно
		weight: question.weight || 100,
		title: question.title,
		answers,
		explanation: question.explanation || '',
	}
}

export const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, onClose, testId, editQuestion }) => {
	const [state, setState] = useState<QuestionState>(INITIAL_STATE)
	const addQuestion = useAddQuestion(testId)
	const updateQuestion = useUpdateQuestion()

	const isEditMode = !!editQuestion

	useEffect(() => {
		if (!isOpen) {
			setState(INITIAL_STATE)
		} else if (editQuestion) {
			// Если редактируем вопрос, заполняем форму данными
			setState(questionToState(editQuestion))
		}
	}, [isOpen, editQuestion])

	const handleTypeSelect = useCallback((type: QuestionType) => {
		setState(prev => ({
			...prev,
			type,
			answers: getDefaultAnswers(type),
			step: 2
		}))
	}, [])

	const handleChange = useCallback((data: Partial<QuestionState>) => {
		setState(prev => ({ ...prev, ...data }))
	}, [])

	const handleBack = useCallback(() => {
		setState(prev => ({ ...prev, step: 1 }))
	}, [])

	const handleSave = useCallback(() => {
		if (!state.type) return

		if (isEditMode && editQuestion) {
			// Режим редактирования
			const options: string[] = []
			const correctAnswers: string[] = []

			// Преобразуем answers обратно в options и correctAnswers
			if (state.type === 'TRUE_FALSE') {
				options.push('Дұрыс', 'Бұрыс')
				state.answers.forEach(answer => {
					if (answer.correct) {
						correctAnswers.push(answer.text)
					}
				})
			} else if (state.type === 'SHORT_ANSWER' || state.type === 'OPEN_QUESTION') {
				if (state.answers[0]?.text) {
					correctAnswers.push(state.answers[0].text)
				}
			} else if (state.type === 'MULTIPLE_CHOICE') {
				state.answers.forEach(answer => {
					if (answer.text.trim()) {
						options.push(answer.text)
						if (answer.correct) {
							correctAnswers.push(answer.text)
						}
					}
				})
			}

			updateQuestion.mutate(
				{
					testId,
					questionId: editQuestion.id,
					title: state.title,
					type: state.type,
					options,
					correctAnswers,
					explanation: state.explanation,
					weight: state.weight,
					image: state.image,
				},
				{
					onSuccess: () => {
						onClose()
						setState(INITIAL_STATE)
					},
				}
			)
		} else {
			// Режим создания
			addQuestion.mutate(
				{
					image: state.image,
					weight: state.weight,
					type: state.type,
					title: state.title,
					answers: state.answers,
					explanation: state.explanation,
				},
				{
					onSuccess: () => {
						onClose()
						addQuestion.reset()
						setState(INITIAL_STATE)
					},
				}
			)
		}
	}, [state, addQuestion, updateQuestion, onClose, isEditMode, editQuestion, testId])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-blue-50 bg-opacity-80 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col">
				<div className="p-4 border-b border-gray-200">
					<h2 className="text-lg font-bold">
						{isEditMode ? 'Сұрақты өңдеу' : 'Сұрақ қосу'}
					</h2>
				</div>
				<div className="flex-1 overflow-y-auto">
					{state.step === 1 && (
						<QuestionTypeStep value={state.type} onSelect={handleTypeSelect} />
					)}
					{state.step === 2 && state.type && (
						<QuestionFormStep
							data={{
								image: state.image,
								weight: state.weight,
								type: state.type,
								title: state.title,
								answers: state.answers,
								explanation: state.explanation,
							}}
							onChange={handleChange}
							onBack={handleBack}
							onSave={handleSave}
							isEditMode={isEditMode}
						/>
					)}
				</div>
				<div className="p-4 border-t border-gray-200">
					{(addQuestion.isPending || updateQuestion.isPending) && (
						<div className="text-blue-600 mb-2 text-sm">Сақталуда...</div>
					)}
					{(addQuestion.isError || updateQuestion.isError) && (
						<div className="text-red-600 mb-2 text-sm">Сақтау кезінде қате</div>
					)}
					{addQuestion.isSuccess && (
						<div className="text-green-600 mb-2 text-sm">Сұрақ сәтті қосылды!</div>
					)}
					{updateQuestion.isSuccess && (
						<div className="text-green-600 mb-2 text-sm">Сұрақ сәтті жаңартылды!</div>
					)}
					<div className="flex justify-end">
						<button onClick={() => { onClose(); setState(INITIAL_STATE) }} className="px-4 py-2 bg-gray-200 rounded text-sm">Болдырмау</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default QuestionModal 