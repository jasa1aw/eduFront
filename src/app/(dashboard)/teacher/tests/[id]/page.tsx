'use client'

import QuestionCard from "@/components/ui/QuestionCard"
import { QuestionModal } from "@/components/ui/QuestionModal"
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

	if (isPending) return <div>Загрузка...</div>
	if (isError || !test) return <div>Ошибка загрузки теста</div>
	if(isSuccess) return (
		<div className=''>
			<TestHeaderEdit test={test} />
			<div className="flex justify-end mb-4">
				<button
					className="px-4 py-2 bg-blue-600 text-white rounded"
					onClick={() => setIsQuestionModalOpen(true)}
				>
					Добавить вопрос
				</button>
			</div>
			<ul>
				{questions.map((q, idx) => (
					<QuestionCard
						key={q.id}
						id={q.id}
						number={idx + 1}
						type={q.type}
						title={q.title}
						image={q.image}
						onEdit={() => { /* TODO: реализовать редактирование */ }}
					/>
				))}
			</ul>
			<QuestionModal
				isOpen={isQuestionModalOpen}
				onClose={() => setIsQuestionModalOpen(false)}
				testId={id}
			/>
		</div>
	)
}
