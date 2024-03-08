import {
	Provider,
	Signer,
	SignatureRequest,
	SignatureResponse,
	parseAddresses,
	AddressOption
} from 'scrypt-ts'

import { bsv } from 'scryptlib'

interface PandaPubKey {
	bsvPubKey: string
	ordPubKey: string
	identityPubKey: string
}

interface PandaAddress {
	bsvAddress: string
	ordAddress: string
	identityAddress: string
}

interface PandaBalance {
	bsv: number
	satoshis: number
	usd: string
}

export interface Ordinal {
	txid: string
	vout: number
	outpoint: string
	satoshis: number
	accSats: string
	height: number
	idx: string
	owner: string
	spend: string
	origin: Origin
	data: Data
}

export interface Data {
	insc: Insc
	types: string[]
}

export interface Insc {
	file: File
	json: JSON
}

export interface File {
	hash: string
	size: number
	type: string
}

export interface JSON {
	p: string
	op: string
	amt: string
	tick: string
}

export interface Origin {
	outpoint: string
	data: Data
	num: number
}

type Recipient = {
	satoshis: number
	address: string
}

type TransferOptions = {
	address: string
	origin: string
	outpoint: string
}

type SignMessageResponse = {
	address: string
	message: string
	sig: string
}

export interface PandaSignRequest {
	prevTxid: string
	outputIndex: number
	/** The index of input to sign. */
	inputIndex: number
	/** The previous output satoshis value of the input to spend. */
	satoshis: number
	/** The address(es) of corresponding private key(s) required to sign the input. */
	address: string | string[]
	/** The previous output script of input, default value is a P2PKH locking script for the `address` if omitted. */
	script?: string
	/** The sighash type, default value is `SIGHASH_ALL | SIGHASH_FORKID` if omitted. */
	sigHashType?: number
	/**
	 * Index of the OP_CODESEPARATOR to split the previous output script at during verification.
	 * If undefined, the whole script is used.
	 * */
	csIdx?: number
	/** The extra information for signing. */
	data?: unknown
}

type PandaSignRequestOptions = {
	rawtx: string
	sigRequests: Array<PandaSignRequest>
}

export interface PandaSignResponse {
	/** The index of input. */
	inputIndex: number
	/** The signature.*/
	sig: string
	/** The public key bound with the `sig`. */
	pubKey: string
	/** The sighash type, default value is `SIGHASH_ALL | SIGHASH_FORKID` if omitted. */
	sigHashType: number
	/** The index of the OP_CODESEPARATOR to split the previous output script at.*/
	csIdx?: number
}

interface PandaAPI {
	isConnected(): Promise<boolean>
	connect(): Promise<string>
	disconnect(): Promise<string>
	getAddresses(): Promise<PandaAddress>
	getPubKeys(): Promise<PandaPubKey>
	signMessage(data: {
		message: string
		encoding?: 'utf8' | 'hex' | 'base64'
	}): Promise<SignMessageResponse>
	getBalance(): Promise<PandaBalance>

	getOrdinals(): Promise<Array<Ordinal>>

	sendBsv(recipients: Array<Recipient>): Promise<string>

	transferOrdinal(options: TransferOptions): Promise<string>

	getSignatures(options: PandaSignRequestOptions): Promise<Array<PandaSignResponse>>
}

/**
 * a [signer]{@link https://docs.scrypt.io/how-to-test-a-contract#signer } which implemented the protocol with the [panda wallet]{@link https://panda.com},
 * and dapps can use to interact with the panda wallet
 */
export class PandaSigner extends Signer {
	static readonly DEBUG_TAG = 'PandaSigner'
	private _target: PandaAPI

	constructor(provider: Provider) {
		super(provider)
	}

	/**
	 * Check if the wallet has been authenticated
	 * @returns {boolean} true | false
	 */
	override isAuthenticated(): Promise<boolean> {
		this._initTarget()
		return this._target.isConnected()
	}

	/**
	 * Request wallet authentication
	 * @returns A promise which resolves to if the wallet has been authenticated and the authenticate error message
	 */
	override async requestAuth(): Promise<{ isAuthenticated: boolean; error: string }> {
		let isAuthenticated: boolean = false
		let error: string = ''
		try {
			await this.getConnectedTarget()
			await this.alignProviderNetwork()
			isAuthenticated = true
		} catch (e) {
			error = e.toString()
		}
		return Promise.resolve({ isAuthenticated, error })
	}
	private _initTarget() {
		if (this._target) {
			return
		}

		if (typeof (window as any).panda !== 'undefined') {
			this._target = (window as any).panda
		} else {
			throw new Error('panda is not installed')
		}
	}

	private async getConnectedTarget(): Promise<PandaAPI> {
		const isAuthenticated = await this.isAuthenticated()
		if (!isAuthenticated) {
			// trigger connecting to panda account when it's not authorized.
			try {
				this._initTarget()
				const res = await this._target.connect()

				if (res && res.includes('canceled')) {
					throw new Error(res)
				}
			} catch (e) {
				throw new Error(`panda requestAccount failed: ${e}`)
			}
		}
		return this._target
	}

	override async connect(provider?: Provider): Promise<this> {
		// we should make sure panda is connected  before we connect a provider.
		const isAuthenticated = await this.isAuthenticated()

		if (!isAuthenticated) {
			throw new Error('panda is not connected!')
		}

		if (provider) {
			if (!provider.isConnected()) {
				await provider.connect()
			}
			this.provider = provider
		} else {
			if (this.provider) {
				await this.provider.connect()
			} else {
				throw new Error(`No provider found`)
			}
		}

		return this
	}

	override async getDefaultAddress(): Promise<bsv.Address> {
		const panda = await this.getConnectedTarget()
		const address = await panda.getAddresses()
		return bsv.Address.fromString(address.bsvAddress)
	}

	/**
	 * get identity address of panda wallet
	 * @returns
	 */
	async getIdentityAddress(): Promise<bsv.Address> {
		const panda = await this.getConnectedTarget()
		const address = await panda.getAddresses()
		return bsv.Address.fromString(address.identityAddress)
	}

	/**
	 * get identity PubKey of panda wallet
	 * @returns a PubKey
	 */
	async getIdentityPubKey(): Promise<bsv.PublicKey> {
		const panda = await this.getConnectedTarget()
		const pubKey = await panda.getPubKeys()
		return Promise.resolve(new bsv.PublicKey(pubKey.identityPubKey))
	}

	/**
	 * get ordinals address of panda wallet
	 * @returns
	 */
	async getOrdAddress(): Promise<bsv.Address> {
		const panda = await this.getConnectedTarget()
		const address = await panda.getAddresses()
		return bsv.Address.fromString(address.ordAddress)
	}

	/**
	 * get ordinal PubKey of panda wallet
	 * @returns a PubKey
	 */
	async getOrdPubKey(): Promise<bsv.PublicKey> {
		const panda = await this.getConnectedTarget()
		const pubKey = await panda.getPubKeys()
		return Promise.resolve(new bsv.PublicKey(pubKey.ordPubKey))
	}

	async getNetwork(): Promise<bsv.Networks.Network> {
		const address = await this.getDefaultAddress()
		return Promise.resolve(address.network)
	}

	override async getBalance(
		address?: AddressOption
	): Promise<{ confirmed: number; unconfirmed: number }> {
		if (address) {
			return this.connectedProvider.getBalance(address)
		}

		const panda = await this.getConnectedTarget()
		const balance = await panda.getBalance()
		return Promise.resolve({ confirmed: balance.satoshis, unconfirmed: 0 })
	}

	override async getDefaultPubKey(): Promise<bsv.PublicKey> {
		const panda = await this.getConnectedTarget()
		const pubKey = await panda.getPubKeys()
		return Promise.resolve(new bsv.PublicKey(pubKey.bsvPubKey))
	}

	/**
	 * get all ordinals nft
	 * @returns a list of Ordinals
	 */
	async getOrdinals(): Promise<Array<Ordinal>> {
		const panda = await this.getConnectedTarget()
		const ordinals = await panda.getOrdinals()
		return Promise.resolve(ordinals)
	}

	/**
	 * transfer ordinal nft
	 * @param options
	 * @returns transfer transaction id
	 */
	async transferOrdinal(options: TransferOptions): Promise<string> {
		const panda = await this.getConnectedTarget()
		const txid = await panda.transferOrdinal(options)
		return Promise.resolve(txid)
	}

	override async getPubKey(address: AddressOption): Promise<bsv.PublicKey> {
		throw new Error(`Method ${this.constructor.name}#getPubKey not implemented.`)
	}

	override async signMessage(message: string, address?: AddressOption): Promise<string> {
		if (address) {
			throw new Error(
				`${this.constructor.name}#signMessge with \`address\` param is not supported!`
			)
		}
		const panda = await this.getConnectedTarget()
		const res = await panda.signMessage({ message })
		return res.sig
	}

	override async getSignatures(
		rawTxHex: string,
		sigRequests: SignatureRequest[]
	): Promise<SignatureResponse[]> {
		const panda = await this.getConnectedTarget()
		const network = await this.getNetwork()

		const sigRequests_ = sigRequests.map((sigReq) => ({
			prevTxid: sigReq.prevTxId,
			outputIndex: sigReq.outputIndex,
			inputIndex: sigReq.inputIndex,
			satoshis: sigReq.satoshis,
			address: parseAddresses(sigReq.address, network).map((addr) => addr.toString()),
			script: sigReq.scriptHex,
			sigHashType: sigReq.sigHashType,
			csIdx: sigReq.csIdx,
			data: sigReq.data
		}))

		const sigResults = await panda.getSignatures({
			rawtx: rawTxHex,
			sigRequests: sigRequests_
		})

		return sigResults.map((sigResult) => ({
			...sigResult,
			publicKey: sigResult.pubKey
		}))
	}
}
