'use client'

import { useCallback } from 'react'

interface ToastOptions {
	title?: string
	description?: string
	variant?: 'default' | 'success' | 'destructive'
}

export const useToast = () => {
	const toast = useCallback(({ title, description, variant }: ToastOptions) => {
		console.info(`[toast:${variant ?? 'default'}] ${title ?? ''}`, description ?? '')
	}, [])

	return { toast }
}


