'use client'

import QuestionCard from "@/components/ui/QuestionCard"
import { QuestionModal } from "@/components/ui/QuestionModal"
import { TestHeaderEdit } from "@/components/ui/TestHeaderEdit"
import { useTestById } from "@/hooks/useTestById"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function DetailTestPage() {
	const params = useParams()
	const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''
	const { data: test, isSuccess, isPending, isError } = useTestById(id)
	const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)

	if (isPending) return <div>Загрузка...</div>
	if (isError || !test) return <div>Ошибка загрузки теста</div>

	return (
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
				{test.questions.map((q, idx) => (
					<QuestionCard
						key={q.id}
						number={idx + 1}
						type={q.type}
						title={q.title}
						image={q.image}
						onEdit={() => { /* TODO: реализовать редактирование */ }}
						onDelete={() => { /* TODO: реализовать удаление */ }}
					/>
				))}
			</ul>
			<QuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} testId={id} />
		</div>
	)
}
