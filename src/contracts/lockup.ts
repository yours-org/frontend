import { method, prop, SmartContract, assert, PubKeyHash, Sig, PubKey, hash160 } from 'scrypt-ts'

export class Lockup extends SmartContract {
	@prop()
	lockUntilHeight: bigint

	@prop()
	pkhash: PubKeyHash

	constructor(pkhash: PubKeyHash, lockUntilHeight: bigint) {
		super(...arguments)
		assert(lockUntilHeight < 500000000, 'must use blockHeight locktime')
		this.lockUntilHeight = lockUntilHeight
		this.pkhash = pkhash
	}

	@method()
	public redeem(sig: Sig, pubkey: PubKey) {
		assert(this.ctx.locktime < 500000000, 'must use blockHeight locktime')
		assert(this.ctx.sequence < 0xffffffff, 'must use sequence locktime')
		assert(this.ctx.locktime >= this.lockUntilHeight, 'lockUntilHeight not reached')
		assert(hash160(pubkey) == this.pkhash, 'public key hashes are not equal')
		// Check signature validity.
		assert(this.checkSig(sig, pubkey), 'signature check failed')
	}
}

export const LockupArtifact = {
	version: 9,
	compilerVersion: '1.19.0+commit.72eaeba',
	contract: 'Lockup',
	md5: 'c54afe5c905a671b9be3909711368949',
	structs: [],
	library: [],
	alias: [],
	abi: [
		{
			type: 'function',
			name: 'redeem',
			index: 0,
			params: [
				{
					name: 'sig',
					type: 'Sig'
				},
				{
					name: 'pubkey',
					type: 'PubKey'
				},
				{
					name: '__scrypt_ts_txPreimage',
					type: 'SigHashPreimage'
				}
			]
		},
		{
			type: 'constructor',
			params: [
				{
					name: 'pkhash',
					type: 'Ripemd160'
				},
				{
					name: 'lockUntilHeight',
					type: 'int'
				}
			]
		}
	],
	stateProps: [],
	buildType: 'debug',
	file: 'file:///Users/davidcase/Source/lockup/artifacts/lockup.scrypt',
	hex: '2097dfd76851bf465e8f715593b217714858bbe9570ff3bd5e33840a34e20ff0262102ba79df5f8ae7604a9830f03c7933028186aede0675a16f025dc4f8be8eec0382201008ce7480da41702918d1ec8e6849ba32b4d65b1e40dc669c31a1e6306b266c0000<pkhash><lockUntilHeight>610079040065cd1d9f690079547a75537a537a537a5179537a75527a527a7575615579014161517957795779210ac407f0e4bd44bfc207355a778b046225a7068fc59ee7eda43ad905aadbffc800206c266b30e6a1319c66dc401e5bd6b432ba49688eecd118297041da8074ce081059795679615679aa0079610079517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01007e81517a75615779567956795679567961537956795479577995939521414136d08c5ed2bf3ba048afe6dcaebafeffffffffffffffffffffffffffffff00517951796151795179970079009f63007952799367007968517a75517a75517a7561527a75517a517951795296a0630079527994527a75517a6853798277527982775379012080517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f517f7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e7c7e01205279947f7754537993527993013051797e527e54797e58797e527e53797e52797e57797e0079517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a75517a756100795779ac517a75517a75517a75517a75517a75517a75517a75517a75517a7561517a75517a756169557961007961007982775179517954947f75517958947f77517a75517a756161007901007e81517a7561517a7561040065cd1d9f6955796100796100798277517951790128947f755179012c947f77517a75517a756161007901007e81517a7561517a756105ffffffff009f69557961007961007982775179517954947f75517958947f77517a75517a756161007901007e81517a7561517a75615279a2695679a95179876957795779ac7777777777777777',
	sourceMapFile: ''
}
