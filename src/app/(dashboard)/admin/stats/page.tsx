import { AdminSystemStats } from '@/components/stats/AdminSystemStats'

export default function AdminStatsPage() {
	return (
		<div className="container mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Әкімші тақтасы</h1>
				<p className="text-gray-600 mt-2">Жүйелік статистика және аналитика</p>
			</div>
			<AdminSystemStats />
		</div>
	)
}
