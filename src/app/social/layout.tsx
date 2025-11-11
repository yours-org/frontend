"use client"

import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { AppLayout } from '@/components/layout'
import { Toaster } from '@/components/ui/toaster'

export default function SocialLayout({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<AppLayout>{children}</AppLayout>
			<Toaster />
		</ThemeProvider>
	)
}

