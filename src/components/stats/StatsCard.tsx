'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
	title: string
	value: string | number
	icon: LucideIcon
	color: string
	description?: string
	trend?: {
		value: number
		isPositive: boolean
	}
}

const colorClasses = {
	blue: 'bg-blue-100 text-blue-600',
	green: 'bg-green-100 text-green-600',
	purple: 'bg-purple-100 text-purple-600',
	orange: 'bg-orange-100 text-orange-600',
	red: 'bg-red-100 text-red-600',
	yellow: 'bg-yellow-100 text-yellow-600',
	indigo: 'bg-indigo-100 text-indigo-600',
	pink: 'bg-pink-100 text-pink-600'
}

export function StatsCard({ title, value, icon: Icon, color, description }: StatsCardProps) {
	const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue

	return (
		<Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<p className="text-sm font-medium text-gray-600">{title}</p>
						<p className="text-2xl font-bold text-gray-900">{value}</p>
						{description && (
							<p className="text-xs text-gray-500">{description}</p>
						)}
					</div>
					<div className={cn("p-3 rounded-full", colorClass)}>
						<Icon className="h-6 w-6" />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}