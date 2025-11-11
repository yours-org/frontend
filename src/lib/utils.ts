import { ReactNode } from 'react'

type ClassValue = string | number | null | undefined | false

export function cn(...classes: ClassValue[]) {
	return classes.filter(Boolean).join(' ')
}

export function formatTimeAgo(dateInput: string | number | Date) {
	const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
	const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000)

	if (Number.isNaN(diffInSeconds)) {
		return ''
	}

	const intervals: [number, string][] = [
		[60, 's'],
		[60, 'm'],
		[24, 'h'],
		[7, 'd'],
		[4.34524, 'w'],
		[12, 'mo'],
		[Number.POSITIVE_INFINITY, 'y']
	]

	let remaining = diffInSeconds

	for (const [amount, label] of intervals) {
		if (remaining < amount) {
			const value = Math.max(1, Math.floor(remaining))
			return `${value}${label}`
		}
		remaining /= amount
	}

	return ''
}

export type ChildrenProp = { children?: ReactNode }


