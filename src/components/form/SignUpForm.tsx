"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { StudentSignUpForm } from "./StudentSignUpForm"
import { TeacherSignUpForm } from "./TeacherSignUpForm"

interface SignUpFormProps {
	defaultTab?: "student" | "teacher"
}

export const SignUpForm = ({ defaultTab = "student" }: SignUpFormProps) => {
	return (
		<div className="w-full space-y-8">
			{/* Заголовок */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold text-gray-900">Аккаунт құру</h1>
				<p className="text-gray-600">Аккаунт түрін таңдап, тіркеу формасын толтырыңыз</p>
			</div>

			{/* Tabs для переключения между типами регистрации */}
			<Tabs defaultValue={defaultTab} className="w-full">
				<TabsList className="grid w-full grid-cols-2 bg-gray-100">
					<TabsTrigger
						value="student"
						className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
					>
						Студент
					</TabsTrigger>
					<TabsTrigger
						value="teacher"
						className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
					>
						Оқытушы
					</TabsTrigger>
				</TabsList>

				<TabsContent value="student" className="space-y-6 mt-6">
					<div className="text-center space-y-2">
						<h2 className="text-xl font-semibold text-gray-900">Студентті тіркеу</h2>
						<p className="text-sm text-gray-600">Тесттерге қол жеткізу үшін студент аккаунтын құрыңыз</p>
					</div>
					<StudentSignUpForm />
				</TabsContent>

				<TabsContent value="teacher" className="space-y-6 mt-6">
					<div className="text-center space-y-2">
						<h2 className="text-xl font-semibold text-gray-900">Оқытушыны тіркеу</h2>
						<p className="text-sm text-gray-600">Тесттерді құру және басқару үшін оқытушы аккаунтын құрыңыз</p>
					</div>
					<TeacherSignUpForm />
				</TabsContent>
			</Tabs>

			{/* Ссылка на вход */}
			<div className="text-center">
				<p className="text-sm text-gray-600">
					Аккаунт бар ма?{" "}
					<Link href="/sign-in" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
						Кіру
					</Link>
				</p>
			</div>
		</div>
	)
} 