'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import Sidebar from '@/components/ui/sidebar'
import { USER_ROLES } from '@/constants/auth'
import { Suspense } from 'react'

export default function TeacherLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<RoleGuard allowedRoles={[USER_ROLES.TEACHER]}>
			<div className="flex bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] w-full h-screen overflow-hidden">
				<Sidebar />
				<main className="flex-1 h-full p-6">
					<div className="h-full overflow-y-auto bg-white/80 backdrop-blur-sm pt-8 pb-6 px-8 rounded-3xl shadow-xl border border-white/20
						[&::-webkit-scrollbar]:w-2
						[&::-webkit-scrollbar-track]:rounded-full
						[&::-webkit-scrollbar-track]:bg-gray-100/50
						[&::-webkit-scrollbar-thumb]:rounded-full
						[&::-webkit-scrollbar-thumb]:bg-gradient-to-b
						[&::-webkit-scrollbar-thumb]:from-[#804EED]/60
						[&::-webkit-scrollbar-thumb]:to-[#6B46C1]/60
						[&::-webkit-scrollbar-thumb]:hover:from-[#804EED]/80
						[&::-webkit-scrollbar-thumb]:hover:to-[#6B46C1]/80
						[&::-webkit-scrollbar-thumb]:transition-all
						[&::-webkit-scrollbar-thumb]:duration-200
					">
						<Suspense fallback="Loading">
							{children}
						</Suspense>
					</div>
				</main>
			</div>
		</RoleGuard>
	)
}
