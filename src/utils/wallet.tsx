'use client'

const ADDRESS = 'yours::address'

export default class Wallet {
	public static get isSet(): boolean {
		if (typeof window === 'undefined') {
			return false
		}

		return !!Wallet.address
	}

	public static get address(): string {
		return localStorage.getItem(ADDRESS)
	}

	public static delete() {
		return localStorage.removeItem(ADDRESS)
	}

	public static async signer(): Promise<any> {
		const { PandaSigner } = await import('@/contracts/providers/panda')
		const { Signer, DefaultProvider } = await import('scrypt-ts')
		return new PandaSigner(new DefaultProvider())
	}

	public static async requestAuth() {
		// @ts-ignore
		if (!window.panda) {
			window.open(
				'https://chromewebstore.google.com/detail/yours-wallet/mlbnicldlpdimbjdcncnklfempedeipj',
				'_blank'
			)
			return
		}

		const signer = await this.signer()
		const { isAuthenticated, error } = await signer.requestAuth()

		if (isAuthenticated) {
			const address = await signer.getDefaultAddress()
			localStorage.setItem(ADDRESS, address.toString())
		}
	}
}
