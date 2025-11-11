'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Chrome, Menu, Twitter, X } from 'lucide-react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { GitbookIcon } from '@/components/icons/gitbook-icon'
import useChainInfo from '@/utils/hooks/useChainInfo'
import { usePathname } from 'next/navigation'

const navLinks = [
	{ href: '#overview', label: 'Overview' },
	{ href: '#stats', label: 'Network' },
	{ href: '#toolkit', label: 'Tooling' },
	{ href: '#ecosystem', label: 'Ecosystem' }
]

export default function Header() {
	useChainInfo()
	const pathname = usePathname()
	const [isScrolled, setIsScrolled] = React.useState(false)
	const [isMenuOpen, setIsMenuOpen] = React.useState(false)

	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10)
		}

		handleScroll()
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	React.useEffect(() => {
		if (typeof document === 'undefined') return

		if (!isMenuOpen) {
			document.body.style.overflow = ''
			return
		}

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = previousOverflow
		}
	}, [isMenuOpen])

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsMenuOpen(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		event.preventDefault()

		const targetElement = document.querySelector(href) as HTMLElement | null
		if (targetElement) {
			const headerOffset = 72
			const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY
			const offsetPosition = elementPosition - headerOffset

			window.scrollTo({
				top: offsetPosition >= 0 ? offsetPosition : 0,
				behavior: 'smooth'
			})
		}

		setIsMenuOpen(false)
	}

	if (pathname?.startsWith('/social')) {
		return null
	}

	return (
		<>
			<header
				className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
					isScrolled ? 'backdrop-blur bg-[#050507]/80 border-white/10' : 'border-transparent bg-transparent'
				}`}
			>
				<div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-6 px-6">
					<Link href="/" className="flex items-center text-white">
						<Image src="/logo.svg" alt="Yours Wallet" width={128} height={128} priority className="h-20 w-20" />
					</Link>

					<nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={(event) => handleNavClick(event, link.href)}
								className="transition-colors duration-200 hover:text-white"
							>
								{link.label}
							</a>
						))}
					</nav>

					<div className="flex items-center gap-2 md:gap-3.5">
						<div className="hidden items-center gap-1.5 md:flex">
							<a
								href="https://twitter.com/yourswallet"
								target="_blank"
								rel="noreferrer"
								className="inline-flex h-9 w-9 items-center justify-center text-white/80 transition hover:text-white"
								aria-label="Follow Yours Wallet on Twitter"
							>
								<Twitter className="h-4 w-4" />
							</a>
							<a
								href="https://yours-wallet.gitbook.io/provider-api/"
								target="_blank"
								rel="noreferrer"
								className="inline-flex h-9 w-9 items-center justify-center text-white/80 transition hover:text-white"
								aria-label="Open Yours Wallet GitBook"
							>
								<GitbookIcon className="h-4 w-4" />
							</a>
							<a
								href="https://github.com/yours-org"
								target="_blank"
								rel="noreferrer"
								className="inline-flex h-9 w-9 items-center justify-center text-white/80 transition hover:text-white"
								aria-label="View Yours Wallet on GitHub"
							>
								<GitHubLogoIcon className="h-4 w-4" />
							</a>
							<a
								href="https://chromewebstore.google.com/detail/yours/org.yours.wallet"
								target="_blank"
								rel="noreferrer"
								className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
							>
								<Chrome className="h-4 w-4 transition group-hover:translate-y-0.5" />
								<span>Download Extension</span>
							</a>
						</div>
						<button
							type="button"
							onClick={() => setIsMenuOpen((prev) => !prev)}
							className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white/40 hover:bg-white/20 md:hidden"
							aria-expanded={isMenuOpen}
							aria-label="Toggle navigation menu"
						>
							{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
					</div>
				</div>
			</header>
			{isMenuOpen && (
				<div className="md:hidden">
					<div
						className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
						onClick={() => setIsMenuOpen(false)}
					/>
					<div
						className="fixed inset-y-0 right-0 z-50 flex w-[76%] max-w-xs flex-col gap-6 border-l border-white/10 bg-[#050507]/95 p-6 shadow-[0_20px_60px_rgba(5,10,18,0.65)]"
						style={{ animation: 'mobile-menu-enter 220ms ease-out forwards' }}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 text-white">
								<a
									href="https://yours-wallet.gitbook.io/provider-api/"
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center text-white/70 transition hover:text-white"
									aria-label="Open Yours Wallet GitBook"
								>
									<GitbookIcon className="h-5 w-5" />
								</a>
								<a
									href="https://twitter.com/yourswallet"
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center text-white/70 transition hover:text-white"
									aria-label="Follow Yours Wallet on Twitter"
								>
									<Twitter className="h-5 w-5" />
								</a>
								<a
									href="https://github.com/yours-org"
									target="_blank"
									 rel="noreferrer"
									className="inline-flex items-center text-white/70 transition hover:text-white"
									aria-label="View Yours Wallet on GitHub"
								>
									<GitHubLogoIcon className="h-5 w-5" />
								</a>
							</div>
							<button
								type="button"
								onClick={() => setIsMenuOpen(false)}
								className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-white/40 hover:bg-white/15"
								aria-label="Close navigation menu"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<nav className="flex flex-col gap-4 text-base text-white/80">
							{navLinks.map((link) => (
								<a
									key={link.href}
									href={link.href}
									onClick={(event) => handleNavClick(event, link.href)}
									className="rounded-full border border-transparent px-4 py-2 transition hover:border-white/15 hover:bg-white/5 hover:text-white"
								>
									{link.label}
								</a>
							))}
						</nav>
						<div className="flex flex-col gap-3">
							<a
								href="https://chromewebstore.google.com/detail/yours/org.yours.wallet"
								target="_blank"
								rel="noreferrer"
								className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
							>
								<Chrome className="h-4 w-4 transition group-hover:translate-y-0.5" />
								<span>Download Extension</span>
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
