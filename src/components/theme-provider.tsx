'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
	theme: Theme
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
	children: React.ReactNode
	defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(defaultTheme)

	useEffect(() => {
		const stored = window.localStorage.getItem('yours-theme') as Theme | null
		if (stored) {
			setThemeState(stored)
			return
		}

		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
		setThemeState(prefersDark ? 'dark' : defaultTheme)
	}, [defaultTheme])

	useEffect(() => {
		const root = document.documentElement
		root.classList.remove('light', 'dark')
		root.classList.add(theme)
		window.localStorage.setItem('yours-theme', theme)
	}, [theme])

	const setTheme = (value: Theme) => {
		setThemeState(value)
	}

	const value = useMemo(() => ({ theme, setTheme }), [theme])

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider')
	}
	return context
}


