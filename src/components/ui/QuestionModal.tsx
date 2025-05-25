'use client'

import { useCreateQuestion } from '@/hooks/useCreateQuestion'
import React, { useCallback, useEffect, useState } from "react"
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
				{ text: 'Правда', correct: false },
				{ text: 'Ложь', correct: false },
			]
		case 'SHORT_ANSWER':
		case 'OPEN_QUESTION':
			return [{ text: '', correct: false }]
		default:
			return []
	}
}

export const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, onClose, testId }) => {
	const [state, setState] = useState<QuestionState>(INITIAL_STATE)
	const createQuestion = useCreateQuestion(testId)

	useEffect(() => {
		if (!isOpen) {
			setState(INITIAL_STATE)
		}
	}, [isOpen])

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

		createQuestion.mutate(
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
					createQuestion.reset()
					setState(INITIAL_STATE)
				},
			}
		)
	}, [state, createQuestion, onClose])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-lg">
				<h2 className="text-xl font-bold mb-4">Добавить/Редактировать вопрос</h2>
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
					/>
				)}
				{createQuestion.isPending && <div className="text-blue-600 mt-2">Сохраняем...</div>}
				{createQuestion.isError && <div className="text-red-600 mt-2">Ошибка при сохранении</div>}
				{createQuestion.isSuccess && <div className="text-green-600 mt-2">Вопрос успешно добавлен!</div>}
				<div className="flex justify-end mt-4">
					<button onClick={() => { onClose(); setState(INITIAL_STATE) }} className="px-4 py-2 bg-gray-200 rounded">Отмена</button>
				</div>
			</div>
		</div>
	)
}

export default QuestionModal 