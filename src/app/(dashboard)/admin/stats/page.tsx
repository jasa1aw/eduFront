import { AdminSystemStats } from '@/components/stats/AdminSystemStats'

export default function AdminStatsPage() {
	return (
		<div className="container mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
				<p className="text-gray-600 mt-2">Системная статистика и аналитика</p>
			</div>
			<AdminSystemStats />
		</div>
	)
}
