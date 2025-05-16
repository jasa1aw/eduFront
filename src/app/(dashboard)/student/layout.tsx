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
		<div className="flex bg-[#465FF1] w-full h-screen overflow-x-hidden">
			<Sidebar role="teacher" />
			<main className='w-full h-full p-5'>
				<div className='h-full overflow-y-auto bg-white pt-5 pb-[10px] px-10 rounded-[30px] 
				[&::-webkit-scrollbar]:w-2
				[&::-webkit-scrollbar-track]:rounded-full
				[&::-webkit-scrollbar-track]:bg-gray-100
				[&::-webkit-scrollbar-thumb]:rounded-full
				[&::-webkit-scrollbar-thumb]:bg-gray-300
				'>
					{children}
				</div>
			</main>
		</div>
	)
}
