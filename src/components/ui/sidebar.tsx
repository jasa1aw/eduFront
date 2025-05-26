'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

// Icons
import { ROUTES, USER_ROLES } from '@/constants/auth'
import { useAuthStore } from '@/store/auth/authStore'
import { ChartPie, CirclePlus, LogOut, SquareLibrary, Trophy, Users } from 'lucide-react'
import CreateTestModal from '../modal/CreateTestModal'
// import classesActive from '@/assets/classesActive.svg'
// import classesIcon from '@/assets/classesIcon.svg'
// import competitionActive from '@/assets/competitionActive.svg'
// import competitionIcon from '@/assets/competitionIcon.svg'
// import createTestActive from '@/assets/createTestActive.svg'
// import createTestIcon from '@/assets/createTestIcon.svg'
// import logoutIcon from '@/assets/logoutIcon.svg'
// import statsActive from '@/assets/statsActive.svg'
// import statsIcon from '@/assets/statsIcon.svg'
// import testCollectionActive from '@/assets/testCollectionActive.svg'
// import testCollectionIcon from '@/assets/testCollectionIcon.svg'

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
			title: "Тесты",
			url: ROUTES.STUDENT.TESTS,
			icon: <CirclePlus size={20} />,
		},
		{
			title: "Создать тест",
			url: "#",
			icon: <CirclePlus size={20} />,
			onClick: () => setIsCreateTestModalOpen(true)
		},
		{
			title: "Подключиться к соревнованию",
			url: ROUTES.STUDENT.JOIN_GAME,
			icon: <Trophy size={20} />,
		},
		{
			title: "Создать соревнование",
			url: ROUTES.STUDENT.CREATE_COMPETITION,
			icon: <Trophy size={20} />,
		},
	], [])

	const teacherItems = useMemo(() => [
		{
			title: "Статистика",
			url: ROUTES.TEACHER.STATS,
			icon: <ChartPie size={20} />,
		},
		{
			title: "Тесты",
			url: ROUTES.TEACHER.TESTS,
			icon: <CirclePlus size={20} />,
		},
		{
			title: "Создать Тест",
			url: "#",
			icon: <CirclePlus size={20} />,
			onClick: () => setIsCreateTestModalOpen(true)
		},
		{
			title: "Подключиться к соревнованию",
			url: ROUTES.TEACHER.JOIN_GAME,
			icon: <Trophy size={20} />,
		},
		{
			title: "Создать Соревнование",
			url: ROUTES.TEACHER.CREATE_COMPETITION,
			icon: <Trophy size={20} />,
		},
		{
			title: "Сборник тестов",
			url: ROUTES.TEACHER.TEST_COLLECTION,
			icon: <SquareLibrary size={20} />,
		},
		{
			title: "Классы",
			url: ROUTES.TEACHER.CLASSES,
			icon: <Users size={20} />,
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
			<div className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col">
				<div className="flex-1">
					<div className="mb-8">
						<h2 className="text-xl font-bold">Меню</h2>
						{user && (
							<p className="text-sm text-gray-300 mt-1">
								{isTeacher ? 'Преподаватель' : 'Студент'}: {user.name}
							</p>
						)}
					</div>

					<nav className="space-y-2">
						{items.map((item) => {
							const isActive = pathname === item.url

							return item.onClick ? (
								<button
									key={item.title}
									onClick={item.onClick}
									className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
										}`}
								>
									{item.icon}
									<span>{item.title}</span>
								</button>
							) : (
								<Link
									key={item.title}
									href={item.url}
									className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
										}`}
								>
									{item.icon}
									<span>{item.title}</span>
								</Link>
							)
						})}
					</nav>
				</div>

				<div className="mt-auto">
					<button
						onClick={handleLogout}
						className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 w-full"
					>
						<LogOut
							width={20}
							height={20}
						/>
						<span>Выйти с аккаунта</span>
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
