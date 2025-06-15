import { TeacherStats } from '@/components/stats/TeacherStats'

export default function TeacherStatsPage() {
	return (
		<div className="container mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Панель учителя</h1>
				<p className="text-gray-600 mt-2">Статистика ваших тестов и студентов</p>
			</div>
			<TeacherStats />
		</div>
	)
}
