import type { Test } from "@/hooks/useUserTests"
import React from "react"

interface TestHeaderEditProps {
	test: Test
}

export const TestHeaderEdit: React.FC<TestHeaderEditProps> = ({ test }) => {
	return (
		<div className="bg-white rounded-lg shadow p-5 mb-4 border">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<input
					className="font-bold text-lg border-b-2 focus:outline-none"
					defaultValue={test.title}
				/>
				<div className="flex gap-2">
					<button className="px-3 py-1 bg-blue-600 text-white rounded">Сохранить</button>
					<button className="px-3 py-1 bg-green-600 text-white rounded" disabled={!test.isDraft}>
						Опубликовать
					</button>
					<button className="px-3 py-1 bg-purple-600 text-white rounded" disabled={test.isDraft}>
						Начать соревнование
					</button>
				</div>
			</div>
			<div className="flex gap-4 mt-4">
				<div>
					<label className="block text-xs text-gray-500">Попыток</label>
					<input className="border rounded p-1 w-16" type="number" defaultValue={test.maxAttempts ?? 1} />
				</div>
				<div>
					<label className="block text-xs text-gray-500">Лимит времени (мин)</label>
					<input className="border rounded p-1 w-16" type="number" defaultValue={test.timeLimit ?? 0} />
				</div>
				<div>
					<label className="block text-xs text-gray-500">Баллы за вопрос</label>
					<input className="border rounded p-1 w-16" type="number" defaultValue={1} />
				</div>
				<div>
					<label className="block text-xs text-gray-500">Время на вопрос (сек)</label>
					<input className="border rounded p-1 w-16" type="number" defaultValue={60} />
				</div>
			</div>
		</div>
	)
}

export default TestHeaderEdit 