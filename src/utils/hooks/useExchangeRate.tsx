import useSwr from 'swr'
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function useExchangeRate() {
	const { data, isLoading } = useSwr(
		'https://cloud-functions.twetch.app/api/exchange-rate',
		fetcher
	)
	return { exchangeRate: data?.price, isLoading }
}
