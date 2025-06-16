import { QuestionType } from "@/components/question/QuestionTypeStep"
import React from "react"

interface Answer {
	text: string
	correct: boolean
}

interface QuestionAnswersProps {
	type: QuestionType
	answers: Answer[]
	onChange: (answers: Answer[]) => void
}

// Компонент для вопросов типа "Правда/Ложь"
const TrueFalseAnswers: React.FC<{
	answers: Answer[]
	onChange: (answers: Answer[]) => void
}> = ({ answers, onChange }) => {
	const handleCorrectChange = (index: number) => {
		onChange(answers.map((a, idx) => ({ ...a, correct: idx === index })))
	}

	return (
		<div className="flex gap-3">
			<button
				type="button"
				onClick={() => handleCorrectChange(0)}
				className={`flex-1 p-3 rounded-lg border-2 transition-all ${answers[0]?.correct
					? 'bg-green-500 text-white border-green-500'
					: 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
					}`}
			>
				<div className="flex items-center justify-center">
					<span className="text-xl mr-2">✓</span>
					<span className="font-medium">Дұрыс</span>
				</div>
			</button>
			<button
				type="button"
				onClick={() => handleCorrectChange(1)}
				className={`flex-1 p-3 rounded-lg border-2 transition-all ${answers[1]?.correct
					? 'bg-red-500 text-white border-red-500'
					: 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
					}`}
			>
				<div className="flex items-center justify-center">
					<span className="text-xl mr-2">✗</span>
					<span className="font-medium">Бұрыс</span>
				</div>
			</button>
		</div>
	)
}

// Компонент для коротких ответов
const ShortAnswer: React.FC<{
	answers: Answer[]
	onChange: (answers: Answer[]) => void
}> = ({ answers, onChange }) => {
	const handleTextChange = (text: string) => {
		onChange([{ text, correct: true }])
	}

	return (
		<div className="bg-green-500 rounded-lg p-3">
			<div className="flex items-center mb-2">
				<span className="text-white text-base font-medium">✓ Дұрыс жауап</span>
			</div>
			<input
				type="text"
				className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
				placeholder="Дұрыс жауапты енгізіңіз..."
				value={answers[0]?.text || ''}
				onChange={e => handleTextChange(e.target.value)}
			/>
		</div>
	)
}


// Компонент для множественного выбора
const MultipleChoiceAnswers: React.FC<{
	answers: Answer[]
	onChange: (answers: Answer[]) => void
}> = ({ answers, onChange }) => {
	const handleTextChange = (i: number, text: string) => {
		onChange(answers.map((a, idx) => idx === i ? { ...a, text } : a))
	}

	const handleCorrectChange = (i: number) => {
		onChange(answers.map((a, idx) => idx === i ? { ...a, correct: !a.correct } : a))
	}

	const handleAdd = () => {
		if (answers.length < 10) {
			onChange([...answers, { text: '', correct: false }])
		}
	}

	const handleRemove = (i: number) => {
		if (answers.length > 3) {
			onChange(answers.filter((_, idx) => idx !== i))
		}
	}

	const getAnswerColor = (index: number) => {
		const colors = ['bg-red-500', 'bg-blue-500', 'bg-orange-500', 'bg-green-500']
		return colors[index % colors.length]
	}

	const getAnswerShape = (index: number) => {
		const shapes = ['▲', '♦', '●', '■']
		return shapes[index % shapes.length]
	}

	return (
		<div className="space-y-2">
			{answers.map((answer, index) => (
				<div key={index} className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => handleCorrectChange(index)}
						className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold transition-all ${answer.correct
							? getAnswerColor(index)
							: 'bg-gray-300 hover:bg-gray-400'
							}`}
					>
						{getAnswerShape(index)}
					</button>
					<input
						type="text"
						className="flex-1 p-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
						placeholder={`Нұсқа ${index + 1}`}
						value={answer.text}
						onChange={e => handleTextChange(index, e.target.value)}
					/>
					{answers.length > 3 && (
						<button
							type="button"
							onClick={() => handleRemove(index)}
							className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
						>
							✕
						</button>
					)}
				</div>
			))}
			{answers.length < 10 && (
				<button
					type="button"
					onClick={handleAdd}
					className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm"
				>
					+ Жауап нұсқасын қосу
				</button>
			)}
		</div>
	)
}

export const QuestionAnswers: React.FC<QuestionAnswersProps> = ({ type, answers, onChange }) => {
	if (type === 'TRUE_FALSE') {
		return <TrueFalseAnswers answers={answers} onChange={onChange} />
	}

	if (type === 'SHORT_ANSWER') {
		return <ShortAnswer answers={answers} onChange={onChange} />
	}

	if (type === 'OPEN_QUESTION') {
		return null
	}

	return <MultipleChoiceAnswers answers={answers} onChange={onChange} />
}

export default QuestionAnswers 