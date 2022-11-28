import { sha256 } from "@cosmjs/crypto"
import { fromBase64, toHex, toBech32 } from "@cosmjs/encoding"
import { ValConsPublicKey } from "@terra-money/feather.js"

export class PubKey {
  private key

  constructor(key: ValConsPublicKey) {
    this.key = key
  }

  toBech32(): string {
    const ed25519PubkeyRaw = fromBase64(this.key.key)
    const addressData = sha256(ed25519PubkeyRaw).slice(0, 20)
    return toBech32("terravalcons", addressData)
  }

  toHex(): string {
    const addressData = sha256(fromBase64(this.key.key)).slice(0, 20)
    const address = toHex(addressData).toUpperCase()
    return address
  }
}
