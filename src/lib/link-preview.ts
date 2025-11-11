export interface LinkMetadata {
	url: string
	title?: string
	description?: string
	image?: string
	favicon?: string
	isX?: boolean
}

const urlRegex =
	/(https?:\/\/(?:www\.)?[^\s/$.?#].[^\s]*)/gi

export function extractUrls(text: string) {
	if (!text) return []
	return text.match(urlRegex) ?? []
}

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata | null> {
	if (!url) return null

	// Placeholder metadata until a real endpoint is connected.
	return {
		url,
		title: 'Link preview title',
		description: 'Link preview description placeholder content.',
		image: '/unfurl.png',
		favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}`
	}
}


