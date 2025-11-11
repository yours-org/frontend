declare module 'number-abbreviate' {
	export default class NumberAbbreviate {
		constructor(suffixes?: string[])
		abbreviate(value: number, decimals?: number): string
	}
}
