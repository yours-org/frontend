"use client"

import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from '@/components/providers'
import { AppLayout } from '@/components/layout'
import { Toaster } from '@/components/ui/toaster'

export default function SocialLayout({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<Providers>
				<AppLayout>{children}</AppLayout>
			</Providers>
			<Toaster />
		</ThemeProvider>
	)
}


