'use client'

import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	ReactNode,
	cloneElement,
	isValidElement,
	HTMLAttributes,
	forwardRef
} from 'react'
import { cn } from '@/lib/utils'

interface DropdownContextValue {
	open: boolean
	setOpen: (value: boolean) => void
	menuRef: React.RefObject<HTMLDivElement>
}

const DropdownMenuContext = createContext<DropdownContextValue | undefined>(undefined)

const useDropdownContext = () => {
	const context = useContext(DropdownMenuContext)
	if (!context) {
		throw new Error('Dropdown components must be used within <DropdownMenu>')
	}
	return context
}

interface DropdownMenuProps {
	children: ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
	const [open, setOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!open) return

		const handleClick = (event: MouseEvent) => {
			if (!menuRef.current) return
			if (!menuRef.current.contains(event.target as Node)) {
				setOpen(false)
			}
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClick)
		document.addEventListener('keydown', handleEscape)

		return () => {
			document.removeEventListener('mousedown', handleClick)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [open])

	return (
		<DropdownMenuContext.Provider value={{ open, setOpen, menuRef }}>
			<div className="relative inline-block">{children}</div>
		</DropdownMenuContext.Provider>
	)
}

interface DropdownMenuTriggerProps {
	children: ReactNode
	asChild?: boolean
}

export const DropdownMenuTrigger = ({ children, asChild }: DropdownMenuTriggerProps) => {
	const { open, setOpen } = useDropdownContext()

	const handleToggle = () => setOpen(!open)

	if (asChild && isValidElement(children)) {
		return cloneElement(children, {
			onClick: (event: React.MouseEvent<HTMLElement>) => {
				children.props.onClick?.(event)
				if (!event.defaultPrevented) {
					handleToggle()
				}
			}
		})
	}

	return (
		<button type="button" onClick={handleToggle}>
			{children}
		</button>
	)
}

interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode
	align?: 'start' | 'center' | 'end'
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
	({ children, className, align = 'start', ...props }, ref) => {
		const { open, menuRef } = useDropdownContext()

		if (!open) return null

		const alignmentStyles =
			align === 'end'
				? 'right-0'
				: align === 'center'
					? 'left-1/2 -translate-x-1/2'
					: 'left-0'

		return (
			<div
				ref={(node) => {
					if (typeof ref === 'function') {
						ref(node)
					} else if (ref) {
						ref.current = node
					}
					menuRef.current = node
				}}
				className={cn(
					'absolute z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900',
					alignmentStyles,
					className
				)}
				{...props}
			>
				{children}
			</div>
		)
	}
)

DropdownMenuContent.displayName = 'DropdownMenuContent'

interface DropdownMenuItemProps extends HTMLAttributes<HTMLButtonElement> {
	children: ReactNode
}

export const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
	({ children, className, onClick, ...props }, ref) => {
		const { setOpen } = useDropdownContext()

		return (
			<button
				ref={ref}
				type="button"
				onClick={(event) => {
					onClick?.(event)
					if (!event.defaultPrevented) {
						setOpen(false)
					}
				}}
				className={cn(
					'flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
					className
				)}
				{...props}
			>
				{children}
			</button>
		)
	}
)

DropdownMenuItem.displayName = 'DropdownMenuItem'


