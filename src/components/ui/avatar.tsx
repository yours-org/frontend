'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
	src?: string | null
	alt?: string
	size?: number
	className?: string
}

const palette = [
	'#6366F1',
	'#0EA5E9',
	'#22C55E',
	'#F97316',
	'#F59E0B',
	'#EC4899',
	'#14B8A6',
	'#8B5CF6'
]

export function Avatar({ src, alt = 'User avatar', size = 40, className }: AvatarProps) {
	const dimension = `${size}px`

	const initials = useMemo(() => {
		const label = (alt || '').trim()
		if (!label) return 'U'
		const words = label.split(' ')
		if (words.length === 1) {
			return words[0].slice(0, 2).toUpperCase()
		}
		return (words[0][0] + words[1][0]).toUpperCase()
	}, [alt])

	const background = useMemo(() => {
		const seed = src ?? alt ?? initials
		const total = seed
			.split('')
			.reduce((acc, char) => acc + char.charCodeAt(0), 0)
		return palette[total % palette.length]
	}, [src, alt, initials])

	return (
		<div
			className={cn(
				'flex items-center justify-center rounded-full text-sm font-semibold text-white shadow-inner',
				className
			)}
			style={{
				width: dimension,
				height: dimension,
				background
			}}
			aria-label={alt}
		>
			{initials}
		</div>
	)
}


