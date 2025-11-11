'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Image as ImageIcon, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { extractUrls, fetchLinkMetadata, LinkMetadata } from '@/lib/link-preview'
import { LinkPreview } from '@/components/ui/link-preview'

interface PostComposerProps {
	avatar?: string | null
	onSubmit?: (text: string, metadata?: LinkMetadata | null) => void
	className?: string
}

const expandAnimation = {
	initial: { height: 40, opacity: 0 },
	animate: {
		height: 'auto',
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 700,
			damping: 30
		}
	},
	exit: {
		height: 40,
		opacity: 0,
		transition: {
			type: 'spring',
			stiffness: 700,
			damping: 30
		}
	}
}

export function PostComposer({ avatar, onSubmit, className }: PostComposerProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [text, setText] = useState('')
	const [linkPreview, setLinkPreview] = useState<LinkMetadata | null>(null)
	const [isLoadingPreview, setIsLoadingPreview] = useState(false)

	const composerRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (isExpanded && textareaRef.current) {
			textareaRef.current.focus()
		}
	}, [isExpanded])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!composerRef.current) return
			if (!composerRef.current.contains(event.target as Node) && !text) {
				setIsExpanded(false)
				setIsFocused(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [text])

	useEffect(() => {
		let isMounted = true
		const urls = extractUrls(text)

		if (!urls.length) {
			setLinkPreview(null)
			return
		}

		setIsLoadingPreview(true)

		const timer = setTimeout(async () => {
			const metadata = await fetchLinkMetadata(urls[0])
			if (isMounted) {
				setLinkPreview(metadata)
				setIsLoadingPreview(false)
			}
		}, 400)

		return () => {
			isMounted = false
			clearTimeout(timer)
		}
	}, [text])

	const handleSubmit = () => {
		const trimmed = text.trim()
		if (!trimmed) return

		onSubmit?.(trimmed, linkPreview)
		setText('')
		setLinkPreview(null)
		setIsExpanded(false)
		setIsFocused(false)
	}

	return (
		<motion.div
			ref={composerRef}
			initial={false}
			onClick={() => {
				setIsExpanded(true)
				setIsFocused(true)
			}}
			className={cn(
				'w-full max-w-2xl rounded-3xl bg-neutral-100 p-4 shadow-sm dark:border dark:border-neutral-800 dark:bg-neutral-900',
				className
			)}
		>
			<div className="flex items-start gap-3">
				<Avatar src={avatar ?? undefined} size={40} className="ring-2 ring-neutral-200 dark:ring-neutral-800" />
				<div className="flex-1">
					<AnimatePresence mode="wait">
						<motion.div key={isExpanded ? 'expanded' : 'collapsed'} variants={expandAnimation} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-3">
							<motion.textarea
								ref={textareaRef}
								placeholder="What's happening?"
								value={text}
								onChange={(event) => setText(event.target.value)}
								onFocus={() => setIsFocused(true)}
								className="min-h-[60px] w-full resize-none border-none bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-500 dark:text-neutral-200 dark:placeholder:text-neutral-500"
							/>
							<AnimatePresence>
								{linkPreview && (
									<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
										<LinkPreview
											metadata={{ ...linkPreview, isX: Boolean(linkPreview.url.match(/https?:\/\/(x\.com|twitter\.com)/i)) }}
											onClose={() => setLinkPreview(null)}
											showCloseButton
										/>
									</motion.div>
								)}
							</AnimatePresence>
							{isExpanded && (
								<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-xs text-neutral-500">
										<button
											type="button"
											className="rounded-full p-2 transition hover:bg-neutral-200 dark:hover:bg-neutral-800"
											title="Add media (placeholder)"
										>
											<ImageIcon className="h-4 w-4" />
										</button>
										{isLoadingPreview && <span>Loading preview…</span>}
									</div>
									<button
										type="button"
										onClick={(event) => {
											event.stopPropagation()
											handleSubmit()
										}}
										disabled={!text.trim()}
										className={cn(
											'inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-100 transition disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900',
											!text.trim() ? 'pointer-events-none' : 'hover:bg-neutral-800 dark:hover:bg-neutral-200'
										)}
									>
										<Send className="h-3.5 w-3.5" />
										<span>Post</span>
									</button>
								</motion.div>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</motion.div>
	)
}


