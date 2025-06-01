'use client'

import QuestionCard from "@/components/ui/QuestionCard"
import { QuestionModal } from "@/components/ui/QuestionModal"
import TestActionButtons from "@/components/ui/TestActionButtons"
import { TestHeaderEdit } from "@/components/ui/TestHeaderEdit"
import { useTestById } from "@/hooks/useTestById"
import type { Question } from "@/hooks/useUserTests"
import { useQuestionStore } from "@/store/questionStore"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function DetailTestPage() {
	const params = useParams()
	const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''
	const { data: test, isSuccess, isPending, isError } = useTestById(id)
	const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
	const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

	const { questions, setQuestions } = useQuestionStore()

	// Инициализируем стор вопросами из теста
	useEffect(() => {
		if (test?.questions) {
			// Преобразуем вопросы в нужный формат
			const formattedQuestions: Question[] = test.questions.map(q => ({
				...q,
				explanation: q.explanation || null,
				image: q.image || null,
				weight: q.weight || 0,
				options: q.options || [],
				correctAnswers: q.correctAnswers || []
			}))
			setQuestions(formattedQuestions)
		}
	}, [test?.questions, setQuestions])

	if (isPending) return <div>Жүктелуде...</div>
	if (isError || !test) return <div>Тестті жүктеуде қате</div>
	if (isSuccess) return (
		<div className='w-full h-full'>
			{/* Action Buttons at the top */}
			<TestActionButtons test={test} />

			{/* Main content with Questions and About exam */}
			<div className="flex gap-8">
				{/* Left side - Questions */}
				<div className="flex-1">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-semibold">Сұрақтар</h2>
						<button
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
							onClick={() => {
								setEditingQuestion(null)
								setIsQuestionModalOpen(true)
							}}
						>
							+ Сұрақ қосу
						</button>
					</div>

					<div className="space-y-4">
						{questions.map((q, idx) => (
							<QuestionCard
								key={q.id}
								id={q.id}
								number={idx + 1}
								type={q.type}
								title={q.title}
								image={q.image}
								points={q.weight || 2}
								options={q.options}
								correctAnswers={q.correctAnswers}
								showAnswers={test.showAnswers}
								onEdit={() => {
									setEditingQuestion(q)
									setIsQuestionModalOpen(true)
								}}
							/>
						))}
					</div>
				</div>

				{/* Right side - About exam */}
				<div className="w-1/4">
					<TestHeaderEdit test={test} questionsCount={questions.length} />
				</div>
			</div>

			<QuestionModal
				isOpen={isQuestionModalOpen}
				onClose={() => {
					setIsQuestionModalOpen(false)
					setEditingQuestion(null)
				}}
				testId={id}
				editQuestion={editingQuestion}
			/>
		</div>
	)
}
