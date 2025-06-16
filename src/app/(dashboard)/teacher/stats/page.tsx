import { TeacherStats } from '@/components/stats/TeacherStats'

export default function TeacherStatsPage() {
	return (
		<div className="container mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Мұғалім панелі</h1>
				<p className="text-gray-600 mt-2">Сіздің тесттеріңіз және студенттеріңіздің статистикалық ақпараты</p>
			</div>
			<TeacherStats />
		</div>
	)
}
