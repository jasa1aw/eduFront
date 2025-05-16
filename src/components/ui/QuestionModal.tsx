import { useCreateQuestion } from '@/hooks/useCreateQuestion'
import React, { useState } from "react"
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

const initialState = {
	step: 1 as 1 | 2,
	type: undefined as QuestionType | undefined,
	image: null as File | null,
	weight: 100,
	timeLimit: 10,
	title: '',
	answers: [] as Answer[],
}

export const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, onClose, testId }) => {
	const [state, setState] = useState(initialState)
	const createQuestion = useCreateQuestion(testId)

	React.useEffect(() => {
		if (!isOpen) setState(initialState)
	}, [isOpen])

	if (!isOpen) return null

	// Автоматически подставлять дефолтные ответы при выборе типа
	const handleTypeSelect = (type: QuestionType) => {
		let answers: Answer[] = []
		if (type === 'MULTIPLE_CHOICE') answers = Array(4).fill(0).map(() => ({ text: '', correct: false }))
		if (type === 'TRUE_FALSE') answers = [
			{ text: 'Правда', correct: false },
			{ text: 'Ложь', correct: false },
		]
		if (type === 'SHORT_ANSWER') answers = [{ text: '', correct: false }]
		if (type === 'OPEN_QUESTION') answers = [{ text: '', correct: false }]
		setState(s => ({ ...s, type, answers, step: 2 }))
	}

	const handleChange = (data: any) => setState(s => ({ ...s, ...data }))

	const handleBack = () => setState(s => ({ ...s, step: 1 }))

	const handleSave = () => {
		createQuestion.mutate(
			{
				image: state.image,
				weight: state.weight,
				timeLimit: state.timeLimit,
				type: state.type!,
				title: state.title,
				answers: state.answers,
			},
			{
				onSuccess: () => {
					onClose()
					createQuestion.reset()
					setState(initialState)
				},
			}
		)
	}

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
							timeLimit: state.timeLimit,
							type: state.type,
							title: state.title,
							answers: state.answers,
						}}
						onChange={d => setState(s => ({ ...s, ...d }))}
						onBack={handleBack}
						onSave={handleSave}
					/>
				)}
				{createQuestion.isPending && <div className="text-blue-600 mt-2">Сохраняем...</div>}
				{createQuestion.isError && <div className="text-red-600 mt-2">Ошибка при сохранении</div>}
				{createQuestion.isSuccess && <div className="text-green-600 mt-2">Вопрос успешно добавлен!</div>}
				<div className="flex justify-end mt-4">
					<button onClick={() => { onClose(); setState(initialState) }} className="px-4 py-2 bg-gray-200 rounded">Отмена</button>
				</div>
			</div>
		</div>
	)
}

export default QuestionModal 