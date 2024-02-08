import NumAbbr from 'number-abbreviate'
const numAbbr = new NumAbbr(['k', 'm', 'b', 't', 'q'])

export default function numberWithCommas(x) {
	if (!x) {
		return
	}

	const int = parseInt(x)

	if (!isNaN(int) && int > 100000000) {
		return numAbbr.abbreviate(int, 2).toUpperCase()
	}

	const split = x.toString().split('.')
	const decimals = split[1]
	const value = split[0]

	return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${
		decimals ? `.${decimals}` : ''
	}`
}
