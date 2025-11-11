'use client'

import { useEffect, useMemo, useState } from 'react'
import { PostComposer } from '@/components/ui/post-composer'
import { SocialCard } from '@/components/ui/social-card'
import { ConnectWalletButton } from '@/components/ui/connect-button'
import { formatTimeAgo } from '@/lib/utils'
import { LinkMetadata } from '@/lib/link-preview'
import { useWallet } from '@/components/layout'

interface Author {
	id: string
	address: string
	name: string
	username: string
	avatar: string
}

interface Post {
	id: string
	text: string
	createdAt: string
	author: Author
	linkPreview?: LinkMetadata
	engagement: {
		likes: number
		comments: number
		shares: number
	}
}

const placeholderAuthors: Author[] = [
	{
		id: '0',
		address: '1placeholder0001',
		name: 'Captain Caca',
		username: 'captaincaca',
		avatar: '/pfp/1.png'
	},
	{
		id: '1',
		address: '1placeholder0002',
		name: 'Gilda Gasblast',
		username: 'gildagasblast',
		avatar: '/pfp/4.jpg'
	},
	{
		id: '2',
		address: '1placeholder0003',
		name: 'Duke Doodie',
		username: 'doodieduke',
		avatar: '/pfp/5.png'
	},
	{
		id: '3',
		address: '1placeholder0004',
		name: 'Lady Logjam',
		username: 'ladylogjam',
		avatar: '/pfp/2.jpg'
	},
	{
		id: '4',
		address: '1placeholder0005',
		name: 'Baron von Blowout',
		username: 'baronblowout',
		avatar: '/pfp/3.jpg'
	},
	{
		id: '5',
		address: '1placeholder0006',
		name: 'Professor Pootson',
		username: 'professorpootson',
		avatar: '/pfp/wayne.jpg'
	}
]

const placeholderPosts: Post[] = [
	{
		id: 'p-1',
		text: "Captain's log: shipped a smart bidet that salutes every time it flushes. Crew morale is high, methane levels even higher. 💩🚽",
		createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
		author: placeholderAuthors[0],
		linkPreview: {
			url: 'https://yours.org',
			title: 'Flush Fleet Roadmap',
			description: 'Keeping every deployment shipshape, shipshank, and freshly shanked.',
			image: '/pfp/levelspost.jpg',
			favicon: 'https://www.google.com/s2/favicons?domain=yours.org'
		},
		engagement: {
			likes: 12,
			comments: 3,
			shares: 4
		}
	},
	{
		id: 'p-2',
		text: "QA sprint wrapped! New feature auto-detects silent-but-deadlies and plays a victory trombone. User delight measured in decibels… and tears.",
		createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
		author: placeholderAuthors[1],
		engagement: {
			likes: 32,
			comments: 6,
			shares: 9
		}
	},
	{
		id: 'p-3',
		text: 'Gas fee update: we now offset every toot-saction with a planted whoopee cushion. Sustainable silliness is the only path forward.',
		createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
		author: placeholderAuthors[2],
		engagement: {
			likes: 54,
			comments: 11,
			shares: 20
		}
	},
	{
		id: 'p-4',
		text: 'Lady Logjam here—implemented a flush-to-earn model. Users stack sats every time they drop a performance review in porcelain.',
		createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
		author: placeholderAuthors[3],
		linkPreview: {
			url: 'https://yours.org/reports',
			title: 'Flushonomics Whitepaper',
			description: 'A 30-page thesis on liquidity events, both figurative and… aromatic.',
			image: '/pfp/chart.jpg',
			favicon: 'https://www.google.com/s2/favicons?domain=yours.org'
		},
		engagement: {
			likes: 21,
			comments: 5,
			shares: 7
		}
	},
	{
		id: 'p-5',
		text: 'Baron von Blowout just forked the whoopee chain. New consensus: proof-of-guffaw keeps the gas flowing and the devs glowing.',
		createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
		author: placeholderAuthors[4],
		engagement: {
			likes: 47,
			comments: 8,
			shares: 16
		}
	},
	{
		id: 'p-6',
		text: 'Professor Pootson shipped an AI that predicts office crop-dusts and sends pre-emptive candle deploys. Accuracy: 96%, APR: aromatic.',
		createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
		author: placeholderAuthors[5],
		engagement: {
			likes: 39,
			comments: 4,
			shares: 12
		}
	}
]

export default function SocialPage() {
	const { isConnected, user, connect } = useWallet()
	const [posts, setPosts] = useState<Post[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setPosts(placeholderPosts)
			setIsLoading(false)
		}, 600)

		return () => clearTimeout(timeout)
	}, [])

	const activeAuthor = useMemo(() => {
		if (user) return user
		return placeholderAuthors[0]
	}, [user])

	const handleCreatePost = (text: string, metadata?: LinkMetadata | null) => {
		const newPost: Post = {
			id: `p-${Date.now()}`,
			text,
			createdAt: new Date().toISOString(),
			author: {
				id: activeAuthor.id,
				address: activeAuthor.address,
				name: activeAuthor.name,
				username: activeAuthor.username,
				avatar: activeAuthor.avatar
			},
			linkPreview: metadata || undefined,
			engagement: {
				likes: 0,
				comments: 0,
				shares: 0
			}
		}

		setPosts((prev) => [newPost, ...prev])
	}

	const handleDeletePost = (postId: string) => {
		setPosts((prev) => prev.filter((post) => post.id !== postId))
	}

	if (isLoading) {
		return (
			<div className="flex h-full min-h-[60vh] items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-50" />
			</div>
		)
	}

	return (
		<div className="flex flex-1 flex-col items-center gap-6">
			<div className="flex w-full justify-center">
				{isConnected ? (
					<PostComposer avatar={activeAuthor.avatar} onSubmit={handleCreatePost} className="max-w-2xl" />
				) : (
					<div className="w-full max-w-2xl rounded-3xl border border-dashed border-neutral-300 bg-neutral-100 p-6 text-center dark:border-neutral-700 dark:bg-neutral-900">
						<p className="text-sm text-neutral-600 dark:text-neutral-400">Connect to start posting placeholder updates.</p>
						<div className="mt-4 flex justify-center">
							<ConnectWalletButton />
						</div>
					</div>
				)}
			</div>

			<section className="flex w-full max-w-2xl flex-col items-center gap-3">
				{posts.length ? (
					posts.map((post, index) => (
						<SocialCardWrapper
							key={post.id}
							post={post}
							isFirst={index === 0}
							onDelete={handleDeletePost}
							currentAddress={user?.address ?? null}
						/>
					))
				) : (
					<div className="w-full rounded-3xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
						No posts yet. Share the first update about your build!
					</div>
				)}
			</section>
		</div>
	)
}

function SocialCardWrapper({
	post,
	isFirst,
	onDelete,
	currentAddress
}: {
	post: Post
	isFirst: boolean
	onDelete: (id: string) => void
	currentAddress: string | null
}) {
	return (
		<SocialCard
			id={post.id}
			author={{
				name: post.author.name,
				username: post.author.username,
				avatar: post.author.avatar,
				address: post.author.address,
				timeAgo: formatTimeAgo(post.createdAt)
			}}
			content={{
				text: post.text,
				link: post.linkPreview
			}}
			engagement={post.engagement}
			onLike={() => {}}
			onComment={() => {}}
			onShare={() => {}}
			onBookmark={() => {}}
			onDelete={() => onDelete(post.id)}
			userAddress={currentAddress ?? undefined}
			className={isFirst ? 'ring-1 ring-neutral-200 dark:ring-neutral-800' : undefined}
		/>
	)
}


