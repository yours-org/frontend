import { bsv } from 'scrypt-ts'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

const dotenvConfigPath = '.env'
dotenv.config({ path: dotenvConfigPath })

// Read the private key from the .env file.
// The default private key inside the .env file is meant to be used for the Bitcoin testnet.
// See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
let privKey = process.env.PRIVATE_KEY || ''
if (!privKey) {
    genPrivKey()
} else {
    showAddr(bsv.PrivateKey.fromWIF(privKey))
}

export function genPrivKey() {
    const newPrivKey = bsv.PrivateKey.fromRandom('testnet')
    console.log(`Missing private key, generating a new one ...
Private key generated: '${newPrivKey.toWIF()}'
You can fund its address '${newPrivKey.toAddress()}' from the sCrypt faucet https://scrypt.io/faucet`)
    // auto generate .env file with new generated key
    fs.writeFileSync(dotenvConfigPath, `PRIVATE_KEY="${newPrivKey}"`)
    privKey = newPrivKey.toWIF()
}

export function showAddr(privKey: bsv.PrivateKey) {
    console.log(`Private key already present ...
You can fund its address '${privKey.toAddress()}' from the sCrypt faucet https://scrypt.io/faucet`)
}

export const privateKey = bsv.PrivateKey.fromWIF(privKey)
