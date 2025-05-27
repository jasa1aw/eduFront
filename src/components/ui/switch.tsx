'use client'
import { forwardRef } from 'react'

interface SwitchProps {
	id?: string
	checked: boolean
	onChange: (checked: boolean) => void
	label?: string
	description?: string
	disabled?: boolean
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
	({ id, checked, onChange, label, description, disabled = false }, ref) => {
		return (
			<div className="flex items-center justify-between">
				<div className="flex-1">
					{label && (
						<label htmlFor={id} className="text-sm font-medium text-gray-900">
							{label}
						</label>
					)}
					{description && (
						<p className="text-sm text-gray-500 mt-1">{description}</p>
					)}
				</div>
				<button
					ref={ref}
					id={id}
					type="button"
					role="switch"
					aria-checked={checked}
					disabled={disabled}
					onClick={() => onChange(!checked)}
					className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            ${checked
							? 'bg-gradient-to-r from-purple-600 to-purple-700'
							: 'bg-gray-200'
						}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
				>
					<span
						className={`
              inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
              ${checked ? 'translate-x-6' : 'translate-x-1'}
            `}
					/>
				</button>
			</div>
		)
	}
)

Switch.displayName = 'Switch' 