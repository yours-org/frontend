'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
	Bookmark,
	Heart,
	MessageCircle,
	MoreHorizontal,
	Share2,
	Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { LinkPreview } from '@/components/ui/link-preview'
import { LinkMetadata } from '@/lib/link-preview'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

interface AuthorInfo {
	name?: string
	username?: string
	avatar?: string
	timeAgo?: string
	address?: string
}

interface ContentInfo {
	text?: string
	link?: LinkMetadata
}

interface EngagementInfo {
	likes?: number
	comments?: number
	shares?: number
	isLiked?: boolean
	isBookmarked?: boolean
}

interface SocialCardProps {
	id?: string
	author?: AuthorInfo
	content?: ContentInfo
	engagement?: EngagementInfo
	onLike?: () => void
	onComment?: () => void
	onShare?: () => void
	onBookmark?: () => void
	onDelete?: () => void
	userAddress?: string
	className?: string
}

export function SocialCard({
	id,
	author,
	content,
	engagement,
	onLike,
	onComment,
	onShare,
	onBookmark,
	onDelete,
	userAddress,
	className
}: SocialCardProps) {
	const { toast } = useToast()
	const [isDeleting, setIsDeleting] = useState(false)
	const [isLiked, setIsLiked] = useState(Boolean(engagement?.isLiked))
	const [isBookmarked, setIsBookmarked] = useState(Boolean(engagement?.isBookmarked))
	const [likes, setLikes] = useState(engagement?.likes ?? 0)

	const handleLike = () => {
		setIsLiked((prev) => !prev)
		setLikes((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1))
		onLike?.()
	}

	const handleBookmark = () => {
		setIsBookmarked((prev) => !prev)
		onBookmark?.()
	}

	const handleDelete = () => {
		setIsDeleting(true)
		toast({
			variant: 'success',
			title: 'Post deleted',
			description: 'This is a placeholder action.'
		})
		setTimeout(() => {
			onDelete?.()
		}, 250)
	}

	const handleComment = () => onComment?.()
	const handleShare = () => onShare?.()

	return (
		<AnimatePresence>
			{!isDeleting && (
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95 }}
					className={cn(
						'w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900',
						className
					)}
				>
					<div className="flex flex-col gap-4 px-5 py-6">
						<div className="flex items-start justify-between gap-3">
							<div className="flex items-center gap-3">
								<Link href={author?.address ? `/profile/${author.address}` : '#'} className="hover:opacity-80">
									<Avatar
										src={author?.avatar}
										size={44}
										className="ring-2 ring-neutral-200 dark:ring-neutral-700"
									/>
								</Link>
								<div className="flex flex-col">
									<Link href={author?.address ? `/profile/${author.address}` : '#'} className="flex items-center gap-2">
										<span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
											{author?.name ?? 'Yours User'}
										</span>
										<span className="text-xs text-neutral-500 dark:text-neutral-400">
											@{author?.username ?? 'username'}
										</span>
									</Link>
									<span className="text-xs text-neutral-400 dark:text-neutral-500">{author?.timeAgo ?? 'moments ago'}</span>
								</div>
							</div>
							{userAddress && author?.address && userAddress === author.address ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
										>
											<MoreHorizontal className="h-5 w-5" />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="overflow-hidden rounded-2xl">
										<DropdownMenuItem
											onClick={(event) => {
												event.preventDefault()
												handleDelete()
											}}
											className="text-red-600 dark:text-red-400"
										>
											<Trash2 className="h-4 w-4" />
											Delete post
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : null}
						</div>

						<div className="space-y-4">
							{content?.text && (
								<p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{content.text}</p>
							)}
							{content?.link && <LinkPreview metadata={content.link} />}
						</div>

						<div className="flex items-center justify-between gap-2 pt-2">
							<div className="flex items-center gap-6 text-sm">
								<button
									type="button"
									onClick={handleLike}
									className={cn(
										'flex items-center gap-2 text-neutral-500 transition hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100',
										isLiked && 'text-neutral-900 dark:text-neutral-100'
									)}
								>
									<Heart className={cn('h-5 w-5 transition', isLiked && 'fill-current')} />
									<span>{likes}</span>
								</button>

								<button
									type="button"
									onClick={handleComment}
									className="flex items-center gap-2 text-neutral-500 transition hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
								>
									<MessageCircle className="h-5 w-5" />
									<span>{engagement?.comments ?? 0}</span>
								</button>

								<button
									type="button"
									onClick={handleShare}
									className="flex items-center gap-2 text-neutral-500 transition hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
								>
									<Share2 className="h-5 w-5" />
									<span>{engagement?.shares ?? 0}</span>
								</button>
							</div>

							<button
								type="button"
								onClick={handleBookmark}
								className={cn(
									'rounded-full p-2 transition',
									isBookmarked
										? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50'
										: 'text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
								)}
							>
								<Bookmark className={cn('h-5 w-5 transition', isBookmarked && 'fill-current')} />
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}


