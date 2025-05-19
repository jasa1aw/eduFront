import React, { useEffect, useMemo, useRef } from "react"
import ImageDropzone from "./ImageDropzone"
import QuestionAnswers from "./QuestionAnswers"
import QuestionSettings from "./QuestionSettings"
import { QuestionType } from "./QuestionTypeStep"

interface Answer {
	text: string
	correct: boolean
}

interface QuestionFormStepProps {
	data: {
		image?: File | null
		weight: number
		timeLimit: number
		type: QuestionType
		title: string
		answers: Answer[]
		explanation?: string
	}
	onChange: (data: QuestionFormStepProps["data"]) => void
	onBack: () => void
	onSave: () => void
}

type QuestionTypeOption = {
	key: QuestionType
	label: string
}

const questionTypes: QuestionTypeOption[] = [
	{ key: 'MULTIPLE_CHOICE', label: 'Множественный выбор' },
	{ key: 'SHORT_ANSWER', label: 'Короткий ответ' },
	{ key: 'TRUE_FALSE', label: 'Правда или ложь' },
	{ key: 'OPEN_QUESTION', label: 'Открытый вопрос' },
]

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

export const QuestionFormStep: React.FC<QuestionFormStepProps> = ({ data, onChange, onBack, onSave }) => {
	const prevType = useRef<QuestionType>(data.type)

	const handleSettingsChange = useMemo(() => (v: { weight: number; timeLimit: number; type: QuestionType }) => {
		onChange({ ...data, ...v })
	}, [data, onChange])

	const handleTitleChange = useMemo(() => (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ ...data, title: e.target.value })
	}, [data, onChange])

	const handleExplanationChange = useMemo(() => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange({ ...data, explanation: e.target.value })
	}, [data, onChange])

	const handleAnswersChange = useMemo(() => (answers: Answer[]) => {
		onChange({ ...data, answers })
	}, [data, onChange])

	const handleImageChange = useMemo(() => (img: File | null) => {
		onChange({ ...data, image: img })
	}, [data, onChange])

	useEffect(() => {
		if (data.type !== prevType.current) {
			onChange({ ...data, answers: getDefaultAnswers(data.type) })
			prevType.current = data.type
		}
	}, [data.type, onChange])

	return (
		<div className="p-4">
			<ImageDropzone value={data.image} onChange={handleImageChange} />
			<QuestionSettings
				value={{ weight: data.weight, timeLimit: data.timeLimit, type: data.type }}
				onChange={handleSettingsChange}
				questionTypes={questionTypes}
				currentType={data.type}
			/>
			<input
				className="w-full border p-2 rounded mb-4"
				placeholder="Текст вопроса"
				value={data.title}
				onChange={handleTitleChange}
			/>
			<QuestionAnswers
				type={data.type}
				answers={data.answers}
				onChange={handleAnswersChange}
				isTextarea={data.type === 'OPEN_QUESTION' || data.type === 'SHORT_ANSWER'}
				showCorrect={data.type === 'MULTIPLE_CHOICE' || data.type === 'TRUE_FALSE' || data.type === 'SHORT_ANSWER'}
			/>
			<textarea
				className="w-full border p-2 rounded mb-4 min-h-[100px]"
				placeholder="Объяснение ответа (опционально)"
				value={data.explanation || ''}
				onChange={handleExplanationChange}
			/>
			<div className="flex justify-end mt-6 space-x-2">
				<button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Назад</button>
				<button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded">Сохранить</button>
			</div>
		</div>
	)
}

export default QuestionFormStep 