import React, { useEffect, useRef } from "react"
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
		// image?: string | Blob
		weight: number
		timeLimit: number
		type: QuestionType
		title: string
		answers: Answer[]
	}
	onChange: (data: QuestionFormStepProps["data"]) => void
	onBack: () => void
	onSave: () => void
}

const questionTypes = [
	{ key: 'MULTIPLE_CHOICE' as const, label: 'Множественный выбор' },
	{ key: 'SHORT_ANSWER' as const, label: 'Короткий ответ' },
	{ key: 'TRUE_FALSE' as const, label: 'Правда или ложь' },
	{ key: 'OPEN_QUESTION' as const, label: 'Открытый вопрос' },
]

function getDefaultAnswers(type: QuestionType): Answer[] {
	if (type === 'MULTIPLE_CHOICE') return Array(4).fill(0).map(() => ({ text: '', correct: false }))
	if (type === 'TRUE_FALSE') return [
		{ text: 'Правда', correct: false },
		{ text: 'Ложь', correct: false },
	]
	if (type === 'SHORT_ANSWER') return [{ text: '', correct: false }]
	if (type === 'OPEN_QUESTION') return [{ text: '', correct: false }]
	return []
}

export const QuestionFormStep: React.FC<QuestionFormStepProps> = ({ data, onChange, onBack, onSave }) => {
	const prevType = useRef<QuestionType>(data.type)

	useEffect(() => {
		if (data.type !== prevType.current) {
			onChange({ ...data, answers: getDefaultAnswers(data.type) })
			prevType.current = data.type
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.type])

	return (
		<div className="p-4">
			<ImageDropzone value={data.image} onChange={img => onChange({ ...data, image: img })} />
			<QuestionSettings
				value={{ weight: data.weight, timeLimit: data.timeLimit, type: data.type }}
				onChange={v => onChange({ ...data, ...v })}
				questionTypes={questionTypes}
				currentType={data.type}
			/>
			<input
				className="w-full border p-2 rounded mb-4"
				placeholder="Текст вопроса"
				value={data.title}
				onChange={e => onChange({ ...data, title: e.target.value })}
			/>
			<QuestionAnswers
				type={data.type}
				answers={data.answers}
				onChange={answers => onChange({ ...data, answers })}
				isTextarea={data.type === 'OPEN_QUESTION' || data.type === 'SHORT_ANSWER'}
				showCorrect={data.type === 'MULTIPLE_CHOICE' || data.type === 'TRUE_FALSE' || data.type === 'SHORT_ANSWER'}
			/>
			<div className="flex justify-end mt-6 space-x-2">
				<button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Назад</button>
				<button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded">Сохранить</button>
			</div>
		</div>
	)
}

export default QuestionFormStep 