'use client'
import { useEffect } from "react"
import { TestCard } from "@/components/test/TestCard"
import { TestUser } from "@/types/test"
import { useUserTests } from "@/hooks/test/useUserTests"
import { useTestStore } from "@/store/testStore"

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
		<div className="flex flex-wrap gap-4">
			{tests && tests.length > 0 ? (
				tests.map((test: TestUser) => (
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
