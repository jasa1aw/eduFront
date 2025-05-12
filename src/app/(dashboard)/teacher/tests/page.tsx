'use client'
import { TestCard } from "@/components/ui/TestCard"
import { Test, useUserTests } from "@/hooks/useUserTests"

export default function Tests() {
	const { data, isSuccess, isPending, isError } = useUserTests()

	if (isPending) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка при загрузке тестов</div>

	return (
		<div>
			{isSuccess && data && data.length > 0 ? (
				data.map((test: Test) => (
					<TestCard
						key={test.id}
						title={test.title}
						isDraft={test.isDraft}
						maxAttempts={test.maxAttempts ?? 1}
						questionsCount={test.questions.length}
					/>
				))
			) : (
				<div>Нет тестов</div>
			)}
		</div>
	)
}
