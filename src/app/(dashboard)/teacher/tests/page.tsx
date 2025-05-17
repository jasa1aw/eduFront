'use client'
import { TestCard } from "@/components/ui/TestCard"
import { Test, useUserTests } from "@/hooks/useUserTests"
import { useTestStore } from "@/store/testStore"
import { useEffect } from "react"

export default function Tests() {
	const { data, isSuccess, isPending, isError } = useUserTests()
	const setTests = useTestStore((state) => state.setTests)

	useEffect(() => {
		if (isSuccess && data) {
			setTests(data)
		}
	}, [isSuccess, data, setTests])

	const tests = useTestStore((state) => state.tests)

	if (isPending) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка при загрузке тестов</div>

	return (
		<div>
			{tests && tests.length > 0 ? (
				tests.map((test: Test) => (
					<TestCard
						key={test.id}
						id={test.id}
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
