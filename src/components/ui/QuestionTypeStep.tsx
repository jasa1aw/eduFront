import React from "react"

export type QuestionType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'OPEN_QUESTION' | 'TRUE_FALSE'

interface QuestionTypeStepProps {
	value?: QuestionType
	onSelect: (type: QuestionType) => void
}

const types = [
	{ key: 'MULTIPLE_CHOICE', label: 'Множественный выбор', icon: '📄' },
	{ key: 'SHORT_ANSWER', label: 'Короткий ответ', icon: '💬' },
	{ key: 'TRUE_FALSE', label: 'Правда или ложь', icon: '✔️' },
	{ key: 'OPEN_QUESTION', label: 'Открытый вопрос', icon: '📝' },
]

export const QuestionTypeStep: React.FC<QuestionTypeStepProps> = ({ value, onSelect }) => (
	<div className="grid grid-cols-2 gap-4 p-4">
		{types.map(t => (
			<button
				key={t.key}
				className={`border rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all ${value === t.key ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
				onClick={() => onSelect(t.key as QuestionType)}
			>
				<span className="text-3xl mb-2">{t.icon}</span>
				<span className="font-semibold">{t.label}</span>
			</button>
		))}
	</div>
)

export default QuestionTypeStep 