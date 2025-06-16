'use client'
import React, { useMemo } from "react"
import { QuestionType } from "./QuestionTypeStep"

interface QuestionSettingsProps {
	value: { weight: number; type: QuestionType }
	onChange: (v: { weight: number; type: QuestionType }) => void
	questionTypes: { key: QuestionType; label: string }[]
	currentType: QuestionType
}

const WEIGHTS = [50, 100, 200, 500] as const

const STYLES = {
	container: 'flex gap-2 mb-4',
	select: 'border rounded p-2',
	label: 'block text-xs mb-1'
} as const

export const QuestionSettings: React.FC<QuestionSettingsProps> = ({ value, onChange, questionTypes, currentType }) => {
	const handleWeightChange = useMemo(() => (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange({ ...value, weight: Number(e.target.value) })
	}, [value, onChange])


	const handleTypeChange = useMemo(() => (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange({ ...value, type: e.target.value as QuestionType })
	}, [value, onChange])

	return (
		<div className={STYLES.container}>
			<div>
				<label className={STYLES.label}>Салмақ</label>
				<select
					className={STYLES.select}
					value={value.weight}
					onChange={handleWeightChange}
				>
					{WEIGHTS.map(w => (
						<option key={w} value={w}>{w} ұпай</option>
					))}
				</select>
			</div>
			<div>
				<label className={STYLES.label}>Түрі</label>
				<select
					className={STYLES.select}
					value={value.type}
					onChange={handleTypeChange}
				>
					{questionTypes.map(t => (
						<option key={t.key} value={t.key}>{t.label}</option>
					))}
				</select>
			</div>
		</div>
	)
}

export default QuestionSettings 