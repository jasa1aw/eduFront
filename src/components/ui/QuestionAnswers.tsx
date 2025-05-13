import React from "react"
import { QuestionType } from "./QuestionTypeStep"

interface Answer {
	text: string
	correct: boolean
}

interface QuestionAnswersProps {
	type: QuestionType
	answers: Answer[]
	onChange: (answers: Answer[]) => void
	isTextarea?: boolean
	showCorrect?: boolean
}

export const QuestionAnswers: React.FC<QuestionAnswersProps> = ({ type, answers, onChange, isTextarea, showCorrect }) => {
	const minAnswers = type === 'MULTIPLE_CHOICE' ? 4 : type === 'TRUE_FALSE' ? 2 : type === 'SHORT_ANSWER' ? 1 : 1
	const maxAnswers = type === 'MULTIPLE_CHOICE' ? 10 : minAnswers

	const handleTextChange = (i: number, text: string) => {
		const updated = answers.map((a, idx) => idx === i ? { ...a, text } : a)
		onChange(updated)
	}
	const handleCorrectChange = (i: number, correct: boolean) => {
		let updated = answers.map((a, idx) => idx === i ? { ...a, correct } : (type === 'MULTIPLE_CHOICE' ? a : { ...a, correct: false }))
		if (type !== 'MULTIPLE_CHOICE') updated = updated.map((a, idx) => ({ ...a, correct: idx === i ? correct : false }))
		onChange(updated)
	}
	const handleAdd = () => {
		if (answers.length < maxAnswers) onChange([...answers, { text: '', correct: false }])
	}
	const handleRemove = (i: number) => {
		if (answers.length > minAnswers) onChange(answers.filter((_, idx) => idx !== i))
	}

	if (type === 'TRUE_FALSE') {
		const labels = ['Правда', 'Ложь']
		return (
			<div className="space-y-2">
				{answers.map((a, i) => (
					<div key={i} className="flex items-center gap-2">
						<span className="border rounded p-2 flex-1 bg-gray-100">{labels[i]}</span>
						{showCorrect && (
							<input
								type="checkbox"
								checked={!!a.correct}
								onChange={e => handleCorrectChange(i, e.target.checked)}
								className="accent-blue-600"
								title="Правильный ответ"
							/>
						)}
					</div>
				))}
			</div>
		)
	}

	if (type === 'SHORT_ANSWER' || type === 'OPEN_QUESTION') {
		return (
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<textarea
						className="border rounded p-2 flex-1 min-h-[60px]"
						placeholder="Ответ"
						value={answers[0]?.text || ''}
						onChange={e => handleTextChange(0, e.target.value)}
					/>
					{showCorrect && (
						<input
							type="checkbox"
							checked={!!answers[0]?.correct}
							onChange={e => handleCorrectChange(0, e.target.checked)}
							className="accent-blue-600"
							title="Правильный ответ"
						/>
					)}
				</div>
			</div>
		)
	}

	// MULTIPLE_CHOICE
	return (
		<div className="space-y-2">
			{answers.map((a, i) => (
				<div key={i} className="flex items-center gap-2">
					<input
						className="border rounded p-2 flex-1"
						placeholder={`Вариант ${i + 1}`}
						value={a.text}
						onChange={e => handleTextChange(i, e.target.value)}
					/>
					{showCorrect && (
						<input
							type="checkbox"
							checked={!!a.correct}
							onChange={e => handleCorrectChange(i, e.target.checked)}
							className="accent-blue-600"
							title="Правильный ответ"
						/>
					)}
					{type === 'MULTIPLE_CHOICE' && answers.length > minAnswers && (
						<button type="button" onClick={() => handleRemove(i)} className="text-red-500 px-2">✕</button>
					)}
				</div>
			))}
			{type === 'MULTIPLE_CHOICE' && answers.length < maxAnswers && (
				<button type="button" onClick={handleAdd} className="mt-2 px-4 py-1 bg-gray-200 rounded">Добавить вариант</button>
			)}
		</div>
	)
}

export default QuestionAnswers 