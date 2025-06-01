'use client'

import { CreateCompetitionForm } from '@/components/game/CreateCompetitionForm'

export default function CreateCompetition() {
	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Создание соревнования</h1>
					<p className="text-gray-600">Выберите тест и создайте новое соревнование для командной игры</p>
				</div>

				<CreateCompetitionForm />
			</div>
		</div>
	)
}
