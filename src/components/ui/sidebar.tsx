'use client'

import Link from 'next/link'
import { usePathname} from 'next/navigation'

// Icons
import { CirclePlus } from 'lucide-react';
import { SquareLibrary } from 'lucide-react';
import { Users } from 'lucide-react';
import { Trophy } from 'lucide-react';
import { ChartPie } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth/authStore'
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
interface SidebarProps{
	role: string
}

export default function Sidebar({role}:SidebarProps) {
	const { logout } = useAuthStore();
	const pathname = usePathname()

	const studentItems = [
		{
			title: "Статистика",
			url: "/student/stats",
			icon: <ChartPie size={20} />,
		},
		{
			title: "Создать тест",
			url: "/student/create-test",
			icon: <CirclePlus size={20} />,
		},
		{
			title: "Подключиться к соревнованию",
			url: "/student/join-game",
			icon: <Trophy size={20} />,
		},
		{
			title: "Создать соревнование",
			url: "/student/create-competition",
			icon: <Trophy size={20} />,
		},
	]

	const teacherItems = [
		{
			title: "Статистика",
			url: "/teacher/stats",
			icon: <ChartPie size={20} />,
		},
		{
			title: "Создать Тест",
			url: "/teacher/create-test",
			icon: <CirclePlus size={20} />,
		},
		{
			title: "Подключиться к соревнованию",
			url: "/teacher/join-game",
			icon: <Trophy size={20} />,
		},
		{
			title: "Создать Соревнование",
			url: "/teacher/create-competition",
			icon: <Trophy size={20} />,
		},
		{
			title: "Сборник тестов",
			url: "/teacher/test-collection",
			icon: <SquareLibrary size={20} />,
		},
		{
			title: "Классы",
			url: "/teacher/classes",
			icon: <Users size={20} />,
		},
	]

	const handleLogout = async () => {
		await logout()
	}

	const items = role === 'teacher' ? teacherItems : studentItems

	return (
		<div className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col">
			<div className="flex-1">
				<div className="mb-8">
					<h2 className="text-xl font-bold">Меню</h2>
				</div>

				<nav className="space-y-2">
					{items.map((item) => {
						const isActive = pathname === item.url

						return (
							<Link
								key={item.title}
								href={item.url}
								className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
									}`}
							>
								{item.icon}
								{/* <Image
									src={item.icon}
									alt={item.title}
									width={20}
									height={20}
								/> */}
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
	)
}
