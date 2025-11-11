'use client'

import { ReactNode } from 'react'
import { WalletProvider } from '@/components/layout'

export function Providers({ children }: { children: ReactNode }) {
	return <WalletProvider>{children}</WalletProvider>
}

