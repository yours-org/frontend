import { useState } from 'react'
import useEventListener from './useEventListener'

function useWindowSize(initialWidth?: number, initialHeight?: number) {
	const [windowSize, setWindowSize] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : initialWidth,
		height: typeof window !== 'undefined' ? window.innerHeight : initialHeight
	})

	useEventListener('resize', () => {
		const width = window.innerWidth
		const height = window.innerHeight
		requestAnimationFrame(() => {
			setTimeout(() => {
				setWindowSize({
					width,
					height
				})
			}, 0)
		})
	})

	return windowSize
}

export default useWindowSize
