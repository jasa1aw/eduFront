'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

// Icons
import { ROUTES, USER_ROLES } from '@/constants/auth'
import { useAuthStore } from '@/store/auth/authStore'
import { ChartPie, CirclePlus, LogOut, SquareLibrary, Trophy, Users, User, ClipboardList } from 'lucide-react'
import CreateTestModal from '../modal/CreateTestModal'


export default function Sidebar() {
	const { logout, user } = useAuthStore()
	const pathname = usePathname()
	const [isCreateTestModalOpen, setIsCreateTestModalOpen] = useState(false)

	const studentItems = useMemo(() => [
		{
			title: "Статистика",
			url: ROUTES.STUDENT.STATS,
			icon: <ChartPie size={20} />,
		},
		{
			title: "Тесттер",
			url: ROUTES.STUDENT.TESTS,
			icon: <ClipboardList size={20} />,
		},
		{
			title: "Тесті өту",
			url: ROUTES.STUDENT.TAKE_TEST,
			icon: <ClipboardList size={20} />,
		},
		{
			title: "Тест құру",
			url: "#",
			icon: <CirclePlus size={20} />,
			onClick: () => setIsCreateTestModalOpen(true)
		},
		{
			title: "Жарысқа қосылу",
			url: ROUTES.STUDENT.JOIN_GAME,
			icon: <Trophy size={20} />,
		},
		{
			title: "Жарыс құру",
			url: ROUTES.STUDENT.CREATE_COMPETITION,
			icon: <Trophy size={20} />,
		},
		{
			title: "Профиль",
			url: ROUTES.STUDENT.PROFILE,
			icon: <User size={20} />,
		},
	], [])

	const teacherItems = useMemo(() => [
		{
			title: "Статистика",
			url: ROUTES.TEACHER.STATS,
			icon: <ChartPie size={20} />,
		},
		{
			title: "Тесттер",
			url: ROUTES.TEACHER.TESTS,
			icon: <ClipboardList size={20} />,
		},
		{
			title: "Тест құру",
			url: "#",
			icon: <CirclePlus size={20} />,
			onClick: () => setIsCreateTestModalOpen(true)
		},
		{
			title: "Жарысқа қосылу",
			url: ROUTES.TEACHER.JOIN_GAME,
			icon: <Trophy size={20} />,
		},
		{
			title: "Жарыс құру",
			url: ROUTES.TEACHER.CREATE_COMPETITION,
			icon: <Trophy size={20} />,
		},
		{
			title: "Тест жинағы",
			url: ROUTES.TEACHER.TEST_COLLECTION,
			icon: <SquareLibrary size={20} />,
		},
		{
			title: "Профиль",
			url: ROUTES.TEACHER.PROFILE,
			icon: <User size={20} />,
		},
	], [])

	const handleLogout = useCallback(async () => {
		await logout()
	}, [logout])

	// Определяем роль из store пользователя
	const isTeacher = user?.role === USER_ROLES.TEACHER
	const items = isTeacher ? teacherItems : studentItems

	return (
		<>
			<div className="w-72 h-screen bg-gradient-to-b from-[#804EED] via-[#9B6EF7] to-[#6B46C1] text-white flex flex-col shadow-2xl">
				{/* Header */}
				<div className="p-6 border-b border-white/10">
					<div className="flex items-center space-x-3 mb-4">
						<div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
							<span className="text-lg font-bold">T</span>
						</div>
						<h1 className="text-xl font-bold">TestiQ</h1>
					</div>
					{user && (
						<div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
							<p className="text-sm text-white/80 mb-1">
								{isTeacher ? 'Оқытушы' : 'Студент'}
							</p>
							<p className="font-medium truncate">{user.name}</p>
						</div>
					)}
				</div>

				{/* Navigation */}
				<div className="flex-1 p-6">
					<h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
						Мәзір
					</h2>
					<nav className="space-y-2">
						{items.map((item) => {
							const isActive = pathname === item.url

							const baseClasses = "flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group w-full text-left"
							const activeClasses = isActive
								? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20"
								: "hover:bg-white/10 text-white/80 hover:text-white hover:backdrop-blur-sm"

							return item.onClick ? (
								<button
									key={item.title}
									onClick={item.onClick}
									className={`${baseClasses} ${activeClasses}`}
								>
									<span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
										{item.icon}
									</span>
									<span className="font-medium">{item.title}</span>
								</button>
							) : (
								<Link
									key={item.title}
									href={item.url}
									className={`${baseClasses} ${activeClasses}`}
								>
									<span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
										{item.icon}
									</span>
									<span className="font-medium">{item.title}</span>
								</Link>
							)
						})}
					</nav>
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-white/10">
					<button
						onClick={handleLogout}
						className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 w-full transition-all duration-200 group text-white/80 hover:text-white"
					>
						<span className="transition-transform duration-200 group-hover:scale-105">
							<LogOut size={20} />
						</span>
						<span className="font-medium">Аккаунттан шығу</span>
					</button>
				</div>
			</div>

			<CreateTestModal
				isOpen={isCreateTestModalOpen}
				onClose={() => setIsCreateTestModalOpen(false)}
			/>
		</>
	)
}
