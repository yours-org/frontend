import { PandaSigner } from '@/contracts/providers/panda'
import { Signer, DefaultProvider } from 'scrypt-ts'

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

	public static get signer(): Signer {
		return new PandaSigner(new DefaultProvider())
	}

	public static async requestAuth() {
		const { isAuthenticated, error } = await this.signer.requestAuth()

		if (isAuthenticated) {
			const address = await this.signer.getDefaultAddress()
			localStorage.setItem(ADDRESS, address.toString())
		}
	}
}
