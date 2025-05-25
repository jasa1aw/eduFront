import React, { useEffect, useMemo, useRef } from "react"
import ImageDropzone from "./ImageDropzone"
import QuestionAnswers from "./QuestionAnswers"
import { QuestionType } from "./QuestionTypeStep"

interface Answer {
	text: string
	correct: boolean
}

interface QuestionFormStepProps {
	data: {
		image?: File | null
		weight: number
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

	const handleTypeChange = useMemo(() => (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newType = e.target.value as QuestionType
		onChange({ ...data, type: newType })
	}, [data, onChange])

	const handleWeightChange = useMemo(() => (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange({ ...data, weight: Number(e.target.value) })
	}, [data, onChange])

	const handleTitleChange = useMemo(() => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

	const currentTypeLabel = questionTypes.find(t => t.key === data.type)?.label || ''

	const isValidQuestion = useMemo(() => {
		// Проверка наличия текста вопроса
		if (!data.title.trim()) return false

		// Валидация в зависимости от типа вопроса
		switch (data.type) {
			case 'MULTIPLE_CHOICE':
				// Все ответы должны быть заполнены и хотя бы один должен быть правильным
				const hasAllAnswers = data.answers.every(answer => answer.text.trim() !== '')
				const hasCorrectAnswer = data.answers.some(answer => answer.correct)
				return hasAllAnswers && hasCorrectAnswer

			case 'TRUE_FALSE':
				// Должен быть выбран правильный ответ
				return data.answers.some(answer => answer.correct)

			case 'SHORT_ANSWER':
				// Должен быть заполнен правильный ответ
				return data.answers[0]?.text.trim() !== ''

			case 'OPEN_QUESTION':
				// Для открытых вопросов достаточно только текста вопроса
				return true

			default:
				return false
		}
	}, [data.title, data.type, data.answers])

	const getValidationMessage = useMemo(() => {
		if (!data.title.trim()) return 'Введите текст вопроса'

		switch (data.type) {
			case 'MULTIPLE_CHOICE':
				const emptyAnswers = data.answers.filter(answer => !answer.text.trim())
				if (emptyAnswers.length > 0) return 'Заполните все варианты ответов'
				if (!data.answers.some(answer => answer.correct)) return 'Выберите правильный ответ'
				break

			case 'TRUE_FALSE':
				if (!data.answers.some(answer => answer.correct)) return 'Выберите правильный ответ'
				break

			case 'SHORT_ANSWER':
				if (!data.answers[0]?.text.trim()) return 'Введите правильный ответ'
				break
		}

		return null
	}, [data.title, data.type, data.answers])

	return (
		<div className="flex flex-col h-full overflow-hidden p-4">
			{/* Header with timer and points */}


			{/* Scrollable content */}
			<div className="flex-1 overflow-y-auto">
				{/* Image section */}
				<div className="mb-4">
					<ImageDropzone value={data.image} onChange={handleImageChange} />
				</div>
				<div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
					<div className="flex items-center gap-4">

						<div className="flex items-center gap-2">
							<select
								value={data.weight}
								onChange={handleWeightChange}
								className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm border-none outline-none"
							>
								<option value={50}>50 pt</option>
								<option value={100}>100 pt</option>
								<option value={200}>200 pt</option>
								<option value={500}>500 pt</option>
							</select>
						</div>
						<div className="flex items-center gap-2">
							<select
								value={data.type}
								onChange={handleTypeChange}
								className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm border-none outline-none"
							>
								{questionTypes.map(t => (
									<option key={t.key} value={t.key}>{t.label}</option>
								))}
							</select>
						</div>
					</div>
				</div>
				{/* Question text */}
				<div className="mb-4">
					<textarea
						className="w-full border-2 border-gray-200 rounded-lg p-3 text-base resize-none focus:border-blue-500 focus:outline-none"
						placeholder="Введите ваш вопрос здесь..."
						value={data.title}
						onChange={handleTitleChange}
						rows={2}
					/>
				</div>

				{/* Answers section */}
				<div className="mb-4">
					<QuestionAnswers
						type={data.type}
						answers={data.answers}
						onChange={handleAnswersChange}
					/>
				</div>

				{/* Explanation section */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Объяснение ответа (опционально)
					</label>
					<textarea
						className="w-full border-2 border-gray-200 rounded-lg p-3 resize-none focus:border-blue-500 focus:outline-none"
						placeholder="Добавьте объяснение к правильному ответу..."
						value={data.explanation || ''}
						onChange={handleExplanationChange}
						rows={2}
					/>
				</div>
			</div>

			{/* Footer buttons */}
			<div className="pt-4 border-t border-gray-200">
				{getValidationMessage && (
					<div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-600 text-sm">{getValidationMessage}</p>
					</div>
				)}
				<div className="flex justify-between items-center">
					<div className="flex gap-2">
						<button
							onClick={onBack}
							className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
						>
							← Изменить тип
						</button>
					</div>
					<button
						onClick={onSave}
						className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
						disabled={!isValidQuestion}
					>
						Добавить вопрос
					</button>
				</div>
			</div>
		</div>
	)
}

export default QuestionFormStep 