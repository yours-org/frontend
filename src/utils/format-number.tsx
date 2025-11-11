import NumAbbr from 'number-abbreviate'

const numAbbr = new NumAbbr(['k', 'm', 'b', 't', 'q'])

export default function numberWithCommas(
	x: number | string | null | undefined
): string | undefined {
	if (!x) {
		return
	}

	const numericValue = typeof x === 'number' ? x : parseFloat(x)

	if (!Number.isNaN(numericValue) && numericValue > 100000000) {
		return numAbbr.abbreviate(numericValue, 2).toUpperCase()
	}

	const [value, decimals] = x.toString().split('.')

	return `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${decimals ? `.${decimals}` : ''}`
}
