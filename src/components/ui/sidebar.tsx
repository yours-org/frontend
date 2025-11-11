'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, {
	createContext,
	useContext,
	useMemo,
	useState,
	useCallback,
	ReactNode,
	MouseEvent
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarContextValue {
	open: boolean
	setOpen: (value: boolean) => void
	animate: boolean
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

interface SidebarProviderProps {
	children: ReactNode
	open?: boolean
	setOpen?: (value: boolean) => void
	animate?: boolean
}

export const SidebarProvider = ({
	children,
	open: controlledOpen,
	setOpen: controlledSetOpen,
	animate = true
}: SidebarProviderProps) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

	const open = controlledOpen ?? uncontrolledOpen
	const setOpen = useCallback(
		(value: boolean) => {
			if (controlledSetOpen) {
				controlledSetOpen(value)
			} else {
				setUncontrolledOpen(value)
			}
		},
		[controlledSetOpen]
	)

	const value = useMemo(
		() => ({
			open,
			setOpen,
			animate
		}),
		[open, setOpen, animate]
	)

	return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
	const context = useContext(SidebarContext)
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider')
	}
	return context
}

interface SidebarProps extends SidebarProviderProps {
	children: ReactNode
}

export const Sidebar = ({ children, open, setOpen, animate }: SidebarProps) => {
	return (
		<SidebarProvider open={open} setOpen={setOpen} animate={animate}>
			{children}
		</SidebarProvider>
	)
}

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
	const { className, children, ...rest } = props
	const resolvedChildren = children as React.ReactNode

	return (
		<>
			<DesktopSidebar className={className} {...rest}>
				{resolvedChildren}
			</DesktopSidebar>
			<MobileSidebar className={typeof className === 'string' ? className : undefined}>
				{resolvedChildren}
			</MobileSidebar>
		</>
	)
}

export const DesktopSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof motion.div>) => {
	const { open, setOpen, animate } = useSidebar()

	return (
		<motion.div
			className={cn(
				'h-full hidden w-[280px] flex-shrink-0 flex-col bg-neutral-100 px-4 py-5 dark:bg-neutral-900 md:flex',
				className
			)}
			animate={{
				width: animate ? (open ? 280 : 64) : 280
			}}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			{...props}
		>
			{children}
		</motion.div>
	)
}

export const MobileSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<'div'>) => {
	const { open, setOpen } = useSidebar()

	return (
		<div
			className="flex h-14 w-full items-center bg-neutral-100 px-4 py-4 dark:bg-neutral-900 md:hidden"
			{...props}
		>
			<div className="flex w-full items-center justify-between">
				<Link href="/" className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-50">
				<Image
					src="/icon.svg"
						alt="Yours Logo"
						width={24}
						height={24}
						className="h-6 w-6 invert dark:invert-0"
					/>
					<span>Yours</span>
				</Link>
				<Menu
					className="h-6 w-6 cursor-pointer text-neutral-800 dark:text-neutral-200"
					onClick={() => setOpen(!open)}
				/>
			</div>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ x: '-100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '-100%', opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className={cn(
							'fixed inset-0 z-50 flex h-full w-full flex-col justify-between bg-white p-8 dark:bg-neutral-950',
							className
						)}
					>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="absolute right-8 top-8 rounded-full bg-neutral-100 p-2 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
						>
							<X className="h-5 w-5" />
						</button>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

interface Links {
	label: string
	href: string
	icon: ReactNode
	onClick?: (event: MouseEvent) => void
}

interface SidebarLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
	link: Links
	className?: string
}

export const SidebarLink = ({ link, className, ...rest }: SidebarLinkProps) => {
	const { open, animate, setOpen } = useSidebar()

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (typeof window !== 'undefined' && window.innerWidth < 768) {
			setOpen(false)
		}

		link.onClick?.(event)
	}

	return (
		<Link
			href={link.href}
			onClick={handleClick}
			className={cn('flex items-center gap-3 py-2 text-sm text-neutral-700 dark:text-neutral-200', className)}
			{...rest}
		>
			<span className="flex h-9 w-9 items-center justify-center text-neutral-700 dark:text-neutral-200">
				{link.icon}
			</span>
			<motion.span
				animate={{
					opacity: animate ? (open ? 1 : 0) : 1,
					width: animate ? (open ? 'auto' : 0) : 'auto'
				}}
				className="whitespace-pre text-sm font-medium text-neutral-700 dark:text-neutral-100"
			>
				{link.label}
			</motion.span>
		</Link>
	)
}


