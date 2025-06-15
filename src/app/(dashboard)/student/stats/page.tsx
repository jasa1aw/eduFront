import { StudentStats } from '@/components/stats/StudentStats'

export default function StudentStatsPage() {
	return (
		<div className="container mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Моя статистика</h1>
				<p className="text-gray-600 mt-2">Отслеживайте свой прогресс и достижения</p>
			</div>
			<StudentStats />
		</div>
	)
}
