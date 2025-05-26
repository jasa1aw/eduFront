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
		<div className="flex gap-4">
			{tests && tests.length > 0 ? (
				tests.map((test: Test) => (
					<TestCard
						key={test.id}
						id={test.id}
						title={test.title}
						isDraft={test.isDraft}
						maxAttempts={test.maxAttempts ?? 3}
						questionsCount={test.questions?.length ?? 0}
					/>
				))
			) : (
				<div>Нет тестов</div>
			)}
		</div>
	)
}
