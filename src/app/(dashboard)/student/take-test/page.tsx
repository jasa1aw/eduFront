"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function TakeTestPage() {
	const [testLink, setTestLink] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = () => {
		if (!testLink.trim()) return

		setIsLoading(true)

		try {
			// Парсим ссылку для извлечения testId и token
			const url = new URL(testLink)
			const pathParts = url.pathname.split('/')
			const testId = pathParts[pathParts.findIndex(part => part === 'take-test') + 1]
			const token = url.searchParams.get('token')

			if (testId && token) {
				// Перенаправляем на страницу информации о тесте
				router.push(`/student/take-test/${testId}?token=${token}`)
			} else {
				alert("Сілтеменің қате форматы")
				setIsLoading(false)
			}
		} catch (error) {
			alert("Сілтеменің қате форматы")
			setIsLoading(false)
		}
	}

	return (
		<div className="h-full flex items-center justify-center p-4 ">
			<div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-purple">
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
						</svg>
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">Тест тапсыру</h1>
					<p className="text-gray-600">Тест тапсыру үшін сілтемені енгізіңіз</p>
				</div>

				<div className="space-y-6">
					<div>
						<label htmlFor="testLink" className="block text-sm font-medium text-gray-700 mb-2">
							Тестке сілтеме
						</label>
						<input
							id="testLink"
							type="url"
							value={testLink}
							onChange={(e) => setTestLink(e.target.value)}
							placeholder="http://localhost:3000/take-test/uuid-test-id?token=uuid-token"
							className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
							disabled={isLoading}
						/>
					</div>

					<Button
						onClick={handleSubmit}
						disabled={!testLink.trim() || isLoading}
						className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Өту...
							</div>
						) : (
							<>
								▶ Тестке өту
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	)
} 