import type { FormState } from '@/@type/auth'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

export function applyServerErrors<T extends FieldValues>(
	state: FormState,
	setError: UseFormSetError<T>,
): void {
	for (const [field, message] of Object.entries(state.fields)) {
		setError(field as Path<T>, { message })
	}
}
