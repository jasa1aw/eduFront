import { Switch } from "@/components/ui/switch"
import { useUpdateTest } from "@/hooks/useUpdateTest"
import type { Test } from "@/hooks/useUserTests"
import React, { useState } from "react"

interface TestHeaderEditProps {
	test: Test
	questionsCount: number
}

export const TestHeaderEdit: React.FC<TestHeaderEditProps> = ({ test, questionsCount }) => {
	const updateTestMutation = useUpdateTest()

	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState(test.title)
	const [maxAttempts, setMaxAttempts] = useState(test.maxAttempts ?? 1)
	const [timeLimit, setTimeLimit] = useState(test.timeLimit ?? 30)
	const [examMode, setExamMode] = useState(test.examMode ?? false)

	const handleSaveTest = () => {
		updateTestMutation.mutate({
			testId: test.id,
			title,
			maxAttempts,
			timeLimit,
			examMode
		})
		setIsEditing(false)
	}

	return (
		<div className="bg-white">
			{/* Main Content Grid */}
			<div className="grid grid-cols-1 ">
				{/* About Exam Section */}
				<div>
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Емтихан туралы</h2>
						<button
							className="px-3 py-1 text-gray-600 hover:text-gray-800 transition"
							onClick={() => setIsEditing(!isEditing)}
						>
							✏️ Өңдеу
						</button>
					</div>

					<div className="space-y-4">
						{/* Module */}
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
								📚
							</div>
							<div className="flex-1">
								<div className="text-sm text-gray-500">Модуль</div>
								{isEditing ? (
									<input
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className="border rounded px-2 py-1 w-full font-medium"
										placeholder="Тест атауы"
									/>
								) : (
									<div className="font-medium">{title}</div>
								)}
							</div>
						</div>

						{/* Total Questions */}
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
								❓
							</div>
							<div>
								<div className="text-sm text-gray-500">Барлық сұрақтар</div>
								<div className="font-medium">{questionsCount}</div>
							</div>
						</div>

						{/* Duration */}
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
								⏱️
							</div>
							<div>
								<div className="text-sm text-gray-500">Ұзақтылығы</div>
								{isEditing ? (
									<input
										type="number"
										value={timeLimit}
										onChange={(e) => setTimeLimit(parseInt(e.target.value) || 30)}
										className="border rounded px-2 py-1 w-20"
									/>
								) : (
									<div className="font-medium">{timeLimit} мин</div>
								)}
							</div>
						</div>

						{/* Max Attempts */}
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
								🔄
							</div>
							<div>
								<div className="text-sm text-gray-500">Максималды әрекеттер</div>
								{isEditing ? (
									<input
										type="number"
										value={maxAttempts}
										onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 1)}
										className="border rounded px-2 py-1 w-20"
									/>
								) : (
									<div className="font-medium">{maxAttempts}</div>
								)}
							</div>
						</div>

						{/* Exam Mode */}
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
								🛡️
							</div>
							<div className="flex-1">
								<div className="text-sm text-gray-500">Режим экзамена</div>
								{isEditing ? (
									<Switch
										checked={examMode}
										onChange={setExamMode}
										label=""
										description=""
									/>
								) : (
									<div className="font-medium">
										{examMode ? (
											<span className="text-red-600 flex items-center gap-1">
												<span>Включен</span>
												<span className="text-xs bg-red-100 px-2 py-0.5 rounded-full">Строгий режим</span>
											</span>
										) : (
											<span className="text-gray-600">Выключен</span>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Status */}
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
								📋
							</div>
							<div>
								<div className="text-sm text-gray-500">Күйі</div>
								<div className="font-medium">
									{test.isDraft ? (
										<span className="text-orange-600">Жоба</span>
									) : (
										<span className="text-green-600">Жарияланған</span>
									)}
								</div>
							</div>
						</div>

						{isEditing && (
							<div className="flex gap-2 pt-4">
								<button
									className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
									onClick={handleSaveTest}
									disabled={updateTestMutation.isPending}
								>
									{updateTestMutation.isPending ? 'Сақталуда...' : 'Сақтау'}
								</button>
								<button
									className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
									onClick={() => setIsEditing(false)}
								>
									Болдырмау
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default TestHeaderEdit 