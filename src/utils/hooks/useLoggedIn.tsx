import Wallet from '@/utils/wallet'
import useSWR, { useSWRConfig } from 'swr'

const KEY = '/is-logged-in'

const fetcher = () => {
	return Wallet.isSet
}

const useLoggedIn = () => {
	const { data: loggedIn, mutate } = useSWR(KEY, fetcher)
	return loggedIn
}

const useLogout = () => {
	const { mutate } = useSWRConfig()
	const logout = () => {
		Wallet.delete()
		mutate(KEY)
	}

	return logout
}

const useLogin = () => {
	const { mutate } = useSWRConfig()
	const logIn = async () => {
		await Wallet.requestAuth()
		mutate(KEY)
	}

	return logIn
}

export { useLoggedIn as default, useLogin, useLogout }
