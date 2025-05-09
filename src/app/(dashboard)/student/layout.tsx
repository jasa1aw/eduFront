'use client'

import Sidebar from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/auth/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function StudentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
		if (!isAuthenticated) {
			router.push('/sign-in')
		}
	}, [isAuthenticated, router])

	if (!isClient || !isAuthenticated) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-[#465FF1]">
				<div className="text-white text-xl">Загрузка...</div>
			</div>
		)
	}

	return (
		<div className="flex bg-[#465FF1] w-full h-full">
			<Sidebar role="student" />
			<main className='w-full h-min-screen bg-white pt-5 px-10 pb-[140px] m-5 rounded-[30px]'>
				{children}
			</main>
		</div>
	)
}
