'use client'

import { LinkMetadata } from '@/lib/link-preview'
import { cn } from '@/lib/utils'

interface LinkPreviewProps {
	metadata: LinkMetadata
	onClose?: () => void
	showCloseButton?: boolean
	className?: string
}

export function LinkPreview({ metadata, onClose, showCloseButton, className }: LinkPreviewProps) {
	if (!metadata?.url) return null

	const { url, title, description, image, favicon } = metadata

	return (
		<a
			href={url}
			target="_blank"
			rel="noreferrer"
			className={cn(
				'group block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
				className
			)}
		>
			{image && (
				<div className="relative h-44 w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
					<img
						src={image}
						alt={title ?? url}
						className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
						loading="lazy"
					/>
				</div>
			)}
			<div className="flex items-start gap-3 px-4 py-4">
				{favicon && (
					<div className="relative h-6 w-6 overflow-hidden rounded-full border border-neutral-200 bg-white dark:border-neutral-700">
						<img src={favicon} alt="Site icon" className="h-full w-full object-contain p-1" loading="lazy" />
					</div>
				)}
				<div className="flex-1 space-y-1">
					<p className="line-clamp-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
						{title ?? url}
					</p>
					{description && (
						<p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
					)}
					<p className="text-xs text-neutral-400 dark:text-neutral-500">{new URL(url).hostname}</p>
				</div>
				{showCloseButton && onClose && (
					<button
						type="button"
						onClick={(event) => {
							event.preventDefault()
							onClose()
						}}
						className="rounded-full border border-transparent px-2 py-1 text-xs text-neutral-500 transition hover:border-neutral-200 hover:text-neutral-700 dark:hover:border-neutral-700 dark:hover:text-neutral-200"
					>
						Close
					</button>
				)}
			</div>
		</a>
	)
}


