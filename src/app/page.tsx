'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Chrome, Network, Shield, Sparkles, Twitter } from 'lucide-react'
import { GitHubLogoIcon, RocketIcon } from '@radix-ui/react-icons'
import { GitbookIcon } from '@/components/icons/gitbook-icon'

const statHighlights = [
	{
		value: '2k+',
		label: 'Organic downloads',
		description: 'Trusted by thousands of builders to store keys and sign BSV transactions securely.'
	},
	{
		value: 'Non-custodial',
		label: 'Key management',
		description: 'Private keys stay encrypted on device with deterministic derivation for every app.'
	},
	{
		value: 'Provider API',
		label: 'GitBook docs',
		description: 'Deep integration guide for dApps, event subscriptions, ordinals, and MNEE USD.'
	}
]

const resourceCards = [
	{
		title: 'Provider API GitBook',
		description:
			'Detect the Yours provider, request user permissions, and ship end-to-end web3 experiences with 1Sat Ordinals, BSV20s, and MNEE USD.',
		href: 'https://yours-wallet.gitbook.io/provider-api/',
		icon: Sparkles,
		ctaLabel: 'Open documentation'
	},
	{
		title: 'React OnChain',
		description:
			'World’s first React app deployed entirely on-chain. Explore immutable hosting, versioning, and how Yours Wallet signs on-chain interactions.',
		href: 'https://app.reactonchain.com/content/0fbc6c40adb34111cf8d90ef5e92a0260f6a0dd6b0fa803ba8066783a3ba58aa_0',
		icon: Network,
		ctaLabel: 'View deployment'
	},
	{
		title: 'Panda Wallet Sample App',
		description:
			'Cloneable starter that demonstrates provider detection, request flows, and transaction broadcasting in a production-ready UI.',
		href: 'https://panda-wallet-sample-app.vercel.app/',
		icon: RocketIcon,
		ctaLabel: 'Launch sample'
	}
]

const footerLinks = [
	{ href: '#overview', label: 'Overview' },
	{ href: '#stats', label: 'Network' },
	{ href: '#toolkit', label: 'Tooling' },
	{ href: '#ecosystem', label: 'Ecosystem' }
]

export default function Home() {
	const currentYear = new Date().getFullYear()

	return (
		<>
			<main className="relative flex w-full flex-col items-center pb-24 pt-28 md:pt-32">
			<section
				id="overview"
				className="mx-auto grid w-full max-w-7xl items-center gap-16 px-6 md:grid-cols-[minmax(0,_1.1fr),minmax(0,_0.9fr)]"
			>
				<div className="space-y-8">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
						Powered by Yours
					</p>
					<h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
						Open source wallet infrastructure for BSV developers and users.
					</h1>
					<p className="max-w-xl text-lg text-white/70 md:text-xl">
						Yours Wallet ships a non-custodial, programmable wallet with real-time lock analytics, deep
						documentation, and production tooling so builders can launch Bitcoin-centric experiences faster.
					</p>
					<div className="flex flex-wrap gap-3">
						<a
							href="https://chromewebstore.google.com/detail/yours/org.yours.wallet"
							target="_blank"
							rel="noreferrer"
							className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:border-white/40 hover:bg-white/20"
						>
							<Chrome className="h-4 w-4 transition group-hover:translate-y-0.5" />
							<span>Download extension</span>
						</a>
						<a
							href="https://yours-wallet.gitbook.io/provider-api/"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:text-white hover:border-white/40 hover:bg-white/10"
						>
							<GitbookIcon className="h-4 w-4" />
							<span>Provider API</span>
						</a>
					</div>
				</div>
				<div className="relative mx-auto flex w-full max-w-[420px] justify-center">
					<div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-white/20 via-transparent to-transparent blur-3xl opacity-50" />
					<div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-[0_32px_70px_rgba(5,12,20,0.5)]">
						<Image
							src="/wallet.png"
							alt="Yours Wallet interface"
							width={840}
							height={600}
							className="h-full w-full object-contain"
							priority
						/>
					</div>
				</div>
			</section>

			<section
				id="stats"
				className="mx-auto mt-24 w-full max-w-7xl px-6"
			>
				<div className="grid gap-6 md:grid-cols-3">
					{statHighlights.map(({ value, label, description }) => (
						<div
							key={label}
							className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-[0_25px_60px_rgba(8,12,20,0.45)] backdrop-blur"
						>
							<p className="text-4xl font-semibold text-white">{value}</p>
							<p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-white/60">
								{label}
							</p>
							<p className="mt-4 text-sm text-white/65">{description}</p>
						</div>
					))}
				</div>
			</section>

			<section
				id="toolkit"
				className="mx-auto mt-24 w-full max-w-7xl px-6"
			>
				<div className="mb-10 space-y-3 text-left md:text-center">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Builder toolkit</p>
					<h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
						End-to-end resources to launch and scale.
					</h2>
					<p className="text-base text-white/65 md:mx-auto md:max-w-2xl">
						Everything from documentation and on-chain deployments to live sample applications—curated to keep
						your roadmap moving.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					{resourceCards.map(({ title, description, href, icon: Icon, ctaLabel }) => (
						<div
							key={title}
							className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#0a0d14]/85 p-6 shadow-[0_20px_60px_rgba(9,15,25,0.5)] backdrop-blur"
						>
							<div className="flex items-center justify-between gap-4">
								<div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
									<Icon className="h-5 w-5" />
								</div>
								<span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">
									Resource
								</span>
							</div>
							<h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
							<p className="mt-3 flex-1 text-sm text-white/65">{description}</p>
							<a
								href={href}
								target="_blank"
								rel="noreferrer"
								className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
							>
								<ArrowUpRight className="h-4 w-4" />
								<span>{ctaLabel}</span>
							</a>
						</div>
					))}
				</div>
			</section>

			<section
				id="ecosystem"
				className="mx-auto mt-24 w-full max-w-7xl px-6"
			>
				<div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-tr from-white/10 via-white/5 to-transparent p-10 text-center shadow-[0_30px_80px_rgba(8,15,30,0.6)]">
					<h2 className="text-3xl font-semibold text-white md:text-4xl">
						Let’s ship the next thousand-wallet milestone together.
					</h2>
					<p className="mt-4 text-base text-white/70 md:mx-auto md:max-w-3xl">
						Tell us where you’re headed and the Yours team will help map the wallet, analytics, and partnership
						motion to get you there faster.
					</p>
					<a
						href="https://twitter.com/yoursxbt"
						target="_blank"
						rel="noreferrer"
						className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
					>
						<Twitter className="h-4 w-4" />
						<span>Follow us on Twitter</span>
					</a>
				</div>
			</section>
		</main>
			<footer className="mt-24 w-full border-t border-white/10 bg-[#050507]/80">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 text-white md:flex-row md:items-center md:justify-between">
					<div className="flex flex-col gap-4">
						<Link href="/" className="flex items-center gap-3 text-white">
							<Image src="/logo.svg" alt="Yours Wallet" width={96} height={96} className="h-20 w-20" />
						</Link>
						<p className="max-w-sm text-sm text-white/60">
							Open source wallet infrastructure built for BSV developers, analytics teams, and production dApps.
						</p>
					</div>
					<nav className="flex flex-wrap gap-4 text-sm text-white/65">
						{footerLinks.map(({ href, label }) => (
							<a key={href} href={href} className="transition hover:text-white">
								{label}
							</a>
						))}
					</nav>
					<div className="flex flex-col items-start gap-4 md:items-end">
						<div className="flex flex-wrap items-center gap-3 md:justify-end md:gap-4">
							<a
								href="https://twitter.com/yourswallet"
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center justify-center text-white/70 transition hover:text-white"
								aria-label="Follow Yours Wallet on Twitter"
							>
								<Twitter className="h-4 w-4" />
							</a>
							<a
								href="https://github.com/yours-org"
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center justify-center text-white/70 transition hover:text-white"
								aria-label="View Yours Wallet on GitHub"
							>
								<GitHubLogoIcon className="h-4 w-4" />
							</a>
							<a
								href="https://yours-wallet.gitbook.io/provider-api/"
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center justify-center text-white/70 transition hover:text-white"
								aria-label="Open Yours Wallet GitBook"
							>
								<GitbookIcon className="h-4 w-4" />
							</a>
							<a
								href="https://chromewebstore.google.com/detail/yours/org.yours.wallet"
								target="_blank"
								rel="noreferrer"
								className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/20"
							>
								<Chrome className="h-4 w-4 transition group-hover:translate-y-0.5" />
								<span>Download</span>
							</a>
						</div>
						<p className="text-xs text-white/50">© {currentYear} Yours Wallet. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</>
	)
}
