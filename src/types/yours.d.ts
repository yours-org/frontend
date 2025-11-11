declare global {
	interface YoursProviderAddresses {
		bsvAddress?: string
		identityAddress?: string
		ordAddress?: string
	}

	interface YoursSocialProfile {
		displayName?: string
		avatar?: string
		username?: string
		handle?: string
		profileUrl?: string
		socialUrl?: string
	}

	interface YoursProvider {
		connect: () => Promise<string>
		disconnect?: () => Promise<void>
		getSocialProfile?: () => Promise<YoursSocialProfile | undefined>
		getAddresses?: () => Promise<YoursProviderAddresses | undefined>
	}

	interface Window {
		yours?: YoursProvider
	}

	interface WindowEventMap {
		'yours#initialized': Event
	}
}

export {}
