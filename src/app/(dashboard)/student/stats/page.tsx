import { StudentStats } from '@/components/stats/StudentStats'

export default function StudentStatsPage() {
	return (
		<div className="container mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Менің статистикам</h1>
				<p className="text-gray-600 mt-2">Сіздің прогресс пен жетістіктеріңізді бақылаңыз</p>
			</div>
			<StudentStats />
		</div>
	)
}
