import React from "react"
import { QuestionType } from "./QuestionTypeStep"

interface QuestionSettingsProps {
	value: { weight: number; timeLimit: number; type: QuestionType }
	onChange: (v: { weight: number; timeLimit: number; type: QuestionType }) => void
	questionTypes: { key: QuestionType; label: string }[]
	currentType: QuestionType
}

export const QuestionSettings: React.FC<QuestionSettingsProps> = ({ value, onChange, questionTypes, currentType }) => {
	return (
		<div className="flex gap-2 mb-4">
			<div>
				<label className="block text-xs mb-1">Вес</label>
				<select
					className="border rounded p-2"
					value={value.weight}
					onChange={e => onChange({ ...value, weight: Number(e.target.value) })}
				>
					{[50, 100, 200, 500].map(w => (
						<option key={w} value={w}>{w} pt</option>
					))}
				</select>
			</div>
			<div>
				<label className="block text-xs mb-1">Время</label>
				<select
					className="border rounded p-2"
					value={value.timeLimit}
					onChange={e => onChange({ ...value, timeLimit: Number(e.target.value) })}
				>
					{[10, 20, 30, 60, 90].map(t => (
						<option key={t} value={t}>{t} сек</option>
					))}
				</select>
			</div>
			<div>
				<label className="block text-xs mb-1">Тип</label>
				<select
					className="border rounded p-2"
					value={value.type}
					onChange={e => onChange({ ...value, type: e.target.value as QuestionType })}
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