'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import Sidebar from '@/components/ui/sidebar'
import { USER_ROLES } from '@/constants/auth'

export default function TeacherLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<RoleGuard allowedRoles={[USER_ROLES.TEACHER]}>
			<div className="flex bg-[#465FF1] w-full h-screen overflow-x-hidden">
				<Sidebar />
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
		</RoleGuard>
	)
}
