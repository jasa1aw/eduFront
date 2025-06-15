import React, { useMemo } from "react"

export type QuestionType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'OPEN_QUESTION' | 'TRUE_FALSE'

interface QuestionTypeStepProps {
	value?: QuestionType
	onSelect: (type: QuestionType) => void
}

const QUESTION_TYPES = [
	{ key: 'MULTIPLE_CHOICE' as const, label: 'Множественный выбор', icon: '📄' },
	{ key: 'SHORT_ANSWER' as const, label: 'Короткий ответ', icon: '💬' },
	{ key: 'TRUE_FALSE' as const, label: 'Правда или ложь', icon: '✔️' },
	{ key: 'OPEN_QUESTION' as const, label: 'Открытый вопрос', icon: '📝' },
] as const

const STYLES = {
	button: {
		base: 'border rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all',
		selected: 'border-blue-600 bg-blue-50',
		unselected: 'border-gray-200 bg-white'
	}
} as const

export const QuestionTypeStep: React.FC<QuestionTypeStepProps> = ({ value, onSelect }) => {
	const handleSelect = useMemo(() => (type: QuestionType) => {
		onSelect(type)
	}, [onSelect])

	return (
		<div className="grid grid-cols-2 gap-4 p-4">
			{QUESTION_TYPES.map(t => (
				<button
					key={t.key}
					className={`${STYLES.button.base} ${value === t.key ? STYLES.button.selected : STYLES.button.unselected}`}
					onClick={() => handleSelect(t.key)}
				>
					<span className="text-3xl mb-2">{t.icon}</span>
					<span className="font-semibold">{t.label}</span>
				</button>
			))}
		</div>
	)
}

export default QuestionTypeStep 