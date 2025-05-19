import React, { useMemo } from "react"
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

const TrueFalseAnswers: React.FC<{
	answers: Answer[]
	onChange: (answers: Answer[]) => void
	showCorrect?: boolean
}> = ({ answers, onChange, showCorrect }) => {
	const handleCorrectChange = (i: number, correct: boolean) => {
		onChange(answers.map((a, idx) => ({ ...a, correct: idx === i ? correct : false })))
	}

	return (
		<div className="space-y-2">
			{answers.map((a, i) => (
				<div key={i} className="flex items-center gap-2">
					<span className="border rounded p-2 flex-1 bg-gray-100">{a.text}</span>
					{showCorrect && (
						<input
							type="radio"
							name="true-false"
							checked={a.correct}
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

const ShortAnswer: React.FC<{
	answers: Answer[]
	onChange: (answers: Answer[]) => void
	showCorrect?: boolean
}> = ({ answers, onChange, showCorrect }) => {
	const handleTextChange = (text: string) => {
		onChange([{ ...answers[0], text }])
	}

	const handleCorrectChange = (correct: boolean) => {
		onChange([{ ...answers[0], correct }])
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<textarea
					className="border rounded p-2 flex-1 min-h-[60px]"
					placeholder="Ответ"
					value={answers[0]?.text || ''}
					onChange={e => handleTextChange(e.target.value)}
				/>
				{showCorrect && (
					<input
						type="checkbox"
						checked={answers[0]?.correct}
						onChange={e => handleCorrectChange(e.target.checked)}
						className="accent-blue-600"
						title="Правильный ответ"
					/>
				)}
			</div>
		</div>
	)
}

const MultipleChoiceAnswers: React.FC<{
	answers: Answer[]
	onChange: (answers: Answer[]) => void
	showCorrect?: boolean
	minAnswers: number
	maxAnswers: number
}> = ({ answers, onChange, showCorrect, minAnswers, maxAnswers }) => {
	const handleTextChange = (i: number, text: string) => {
		onChange(answers.map((a, idx) => idx === i ? { ...a, text } : a))
	}

	const handleCorrectChange = (i: number, correct: boolean) => {
		onChange(answers.map((a, idx) => idx === i ? { ...a, correct } : a))
	}

	const handleAdd = () => {
		if (answers.length < maxAnswers) {
			onChange([...answers, { text: '', correct: false }])
		}
	}

	const handleRemove = (i: number) => {
		if (answers.length > minAnswers) {
			onChange(answers.filter((_, idx) => idx !== i))
		}
	}

	return (
		<div className="space-y-2">
			{answers.map((a, i) => (
				<div key={i} className="flex items-center gap-2">
					<div className="flex-1 flex items-center gap-2">
						<input
							className="border rounded p-2 flex-1"
							placeholder={`Вариант ${i + 1}`}
							value={a.text}
							onChange={e => handleTextChange(i, e.target.value)}
						/>
					</div>
					{showCorrect && (
						<input
							type="checkbox"
							checked={a.correct}
							onChange={e => handleCorrectChange(i, e.target.checked)}
							className="accent-blue-600"
							title="Правильный ответ"
						/>
					)}
					{answers.length > minAnswers && (
						<button type="button" onClick={() => handleRemove(i)} className="text-red-500 px-2">✕</button>
					)}
				</div>
			))}
			{answers.length < maxAnswers && (
				<button type="button" onClick={handleAdd} className="mt-2 px-4 py-1 bg-gray-200 rounded">Добавить вариант</button>
			)}
		</div>
	)
}

export const QuestionAnswers: React.FC<QuestionAnswersProps> = ({ type, answers, onChange, isTextarea, showCorrect }) => {
	const { minAnswers, maxAnswers } = useMemo(() => ({
		minAnswers: type === 'MULTIPLE_CHOICE' ? 4 : type === 'TRUE_FALSE' ? 2 : 1,
		maxAnswers: type === 'MULTIPLE_CHOICE' ? 10 : type === 'TRUE_FALSE' ? 2 : 1
	}), [type])

	if (type === 'TRUE_FALSE') {
		return <TrueFalseAnswers answers={answers} onChange={onChange} showCorrect={showCorrect} />
	}

	if (type === 'SHORT_ANSWER' || type === 'OPEN_QUESTION') {
		return <ShortAnswer answers={answers} onChange={onChange} showCorrect={showCorrect} />
	}

	return (
		<MultipleChoiceAnswers
			answers={answers}
			onChange={onChange}
			showCorrect={showCorrect}
			minAnswers={minAnswers}
			maxAnswers={maxAnswers}
		/>
	)
}

export default QuestionAnswers 