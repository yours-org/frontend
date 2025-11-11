'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
	LayoutDashboard,
	LogOut,
	Moon,
	Settings,
	Sun,
	UserCog,
	Users,
	Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { Avatar } from '@/components/ui/avatar'
import { useTheme } from '@/components/theme-provider'

interface WalletUser {
	id: string
	address: string
	name: string
	username: string
	avatar: string
	addresses: {
		bsvAddress: string
		identityAddress?: string
		ordAddress?: string
	}
}

interface WalletContextValue {
	isConnected: boolean
	address: string | null
	user: WalletUser | null
	connect: () => Promise<void>
	disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

export const useWallet = () => {
	const context = useContext(WalletContext)
	if (!context) {
		throw new Error('useWallet must be used within WalletProvider')
	}
	return context
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
	const value = useWalletProviderValue()
	return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

function useWalletProviderValue(): WalletContextValue {
	const [isConnected, setIsConnected] = useState(false)
	const [user, setUser] = useState<WalletUser | null>(null)

	const connect = useCallback(async () => {
		if (typeof window === 'undefined' || !window.yours) {
			console.warn('Yours wallet provider not detected in this environment.')
			return
		}

		try {
			const provider = window.yours
			const publicKey = await provider.connect()

			const [profile, addresses] = await Promise.all([
				provider.getSocialProfile?.().catch((error) => {
					console.warn('Unable to fetch Yours social profile.', error)
					return undefined
				}),
				provider.getAddresses?.().catch((error) => {
					console.warn('Unable to fetch Yours addresses.', error)
					return undefined
				})
			])

			const bsvAddress = addresses?.bsvAddress
			if (!bsvAddress) {
				throw new Error('Yours provider did not return a BSV address.')
			}

			const usernameSource =
				profile?.username ??
				profile?.handle ??
				addresses?.identityAddress ??
				publicKey ??
				bsvAddress

			const resolvedUsername = usernameSource || 'yours-user'
			const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(resolvedUsername)}`

			setUser({
				id: publicKey ?? bsvAddress,
				address: bsvAddress,
				name: profile?.displayName ?? 'Anonymous',
				username: resolvedUsername,
				avatar: profile?.avatar ?? fallbackAvatar,
				addresses: {
					bsvAddress,
					identityAddress: addresses?.identityAddress,
					ordAddress: addresses?.ordAddress
				}
			})
			setIsConnected(true)
		} catch (error) {
			console.error('Failed to connect to Yours wallet.', error)
			setIsConnected(false)
			setUser(null)
		}
	}, [])

	const disconnect = useCallback(async () => {
		if (typeof window !== 'undefined') {
			try {
				await window.yours?.disconnect?.()
			} catch (error) {
				console.warn('Failed to disconnect from Yours wallet.', error)
			}
		}

		setIsConnected(false)
		setUser(null)
	}, [])

	return useMemo(
		() => ({
			isConnected,
			address: user?.address ?? null,
			user,
			connect,
			disconnect
		}),
		[isConnected, user, connect, disconnect]
	)
}

export function AppLayout({ children }: { children: React.ReactNode }) {
	const { theme, setTheme } = useTheme()
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const { isConnected, user, connect, disconnect } = useWallet()

	const formattedAddress = user?.address
		? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
		: 'Connect Wallet'

	const navigationLinks = [
		{
			label: 'Home',
			href: '/',
			icon: <LayoutDashboard className="h-4 w-4" />
		},
		{
			label: 'Social',
			href: '/social',
			icon: <Users className="h-4 w-4" />
		},
		{
			label: 'Profile',
			href: user ? `/profile/${user.username}` : '#',
			icon: <UserCog className="h-4 w-4" />
		},
		{
			label: 'Settings',
			href: '#',
			icon: <Settings className="h-4 w-4" />
		},
		{
			label: theme === 'dark' ? 'Switch to Light' : 'Switch to Dark',
			href: '#',
			onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
			icon:
				theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
		},
		{
			label: 'Sign out',
			href: '#',
			onClick: (event: ReactMouseEvent) => {
				event.preventDefault()
				void disconnect()
			},
			icon: <LogOut className="h-4 w-4" />
		}
	]

	return (
		<div className="flex h-screen w-full flex-col overflow-hidden bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 md:flex-row">
			<Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen}>
				<SidebarBody className="gap-12">
					<div className="flex flex-1 flex-col gap-6 overflow-y-auto">
						{isSidebarOpen ? <Logo /> : <LogoIcon />}
						<nav className="flex flex-col gap-1">
							{navigationLinks.map((link) => (
								<SidebarLink
									key={link.label}
									link={link}
									className={cn(link.onClick && 'cursor-pointer')}
								/>
							))}
						</nav>
					</div>
					<div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
						<SidebarLink
							link={{
								label: formattedAddress,
								href: '#',
								icon: (
									<Avatar
										src={user?.avatar}
										size={32}
										className={cn(
											'ring-2 ring-offset-2',
											isConnected
												? 'ring-green-300 ring-offset-green-50 dark:ring-green-700 dark:ring-offset-neutral-900'
												: 'ring-neutral-200 ring-offset-white dark:ring-neutral-700 dark:ring-offset-neutral-900'
										)}
									/>
								)
							}}
							className={cn(!isConnected && 'opacity-80')}
						/>
						{!isConnected && (
							<button
								type="button"
								onClick={connect}
								className="mt-3 flex w-full items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
								aria-label="Connect Wallet"
							>
								{isSidebarOpen ? 'Connect Wallet' : <Wallet className="h-5 w-5" />}
							</button>
						)}
					</div>
				</SidebarBody>
			</Sidebar>
			<main className="flex flex-1 overflow-y-auto rounded-tl-3xl bg-black">
				<div className="flex w-full flex-1 flex-col gap-6 rounded-tl-3xl bg-black p-4 text-white md:p-10 dark:bg-black">
					{children}
				</div>
			</main>
		</div>
	)
}

const Logo = () => (
	<Link href="/" className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
		<Image
			src="/icon.svg"
			alt="Yours Logo"
			width={28}
			height={26}
			className="h-7 w-7 invert dark:invert-0"
		/>
		<motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			Yours
		</motion.span>
	</Link>
)

const LogoIcon = () => (
	<Link href="/" className="flex items-center text-neutral-900 dark:text-neutral-100">
	<Image src="/icon.svg" alt="Yours Logo" width={28} height={26} className="h-7 w-7 invert dark:invert-0" />
	</Link>
)
