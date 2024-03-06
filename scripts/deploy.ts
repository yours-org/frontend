import { writeFileSync } from 'fs'
import { Frontend } from '../src/contracts/frontend'
import { privateKey } from './privateKey'
import { bsv, TestWallet, DefaultProvider, sha256 } from 'scrypt-ts'

function getScriptHash(scriptPubKeyHex: string) {
    const res = sha256(scriptPubKeyHex).match(/.{2}/g)
    if (!res) {
        throw new Error('scriptPubKeyHex is not of even length')
    }
    return res.reverse().join('')
}

async function main() {
    await Frontend.loadArtifact()

    // Prepare signer. 
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const signer = new TestWallet(privateKey, new DefaultProvider({
        network: bsv.Networks.testnet
    }))

    // TODO: Adjust the amount of satoshis locked in the smart contract:
    const amount = 100

    const instance = new Frontend(
        // TODO: Pass constructor parameter values.
        0n
    )

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)

    // Save deployed contracts script hash.
    const scriptHash = getScriptHash(instance.lockingScript.toHex())
    const shFile = `.scriptHash`;
    writeFileSync(shFile, scriptHash);

    console.log('Frontend contract was successfully deployed!')
    console.log(`TXID: ${deployTx.id}`)
    console.log(`scriptHash: ${scriptHash}`)
}

main()
