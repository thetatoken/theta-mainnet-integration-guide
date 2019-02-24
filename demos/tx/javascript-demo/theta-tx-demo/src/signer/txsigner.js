import RLP from 'eth-lib/lib/rlp';
import Bytes from 'eth-lib/lib/bytes';
import {sha3, sign} from '../crypto'

export class TxSigner {

    static signAndSerializeTx(chainID, tx, privateKey) {
        let signedTx = this.signTx(chainID, tx, privateKey);
        let signedRawBytes = this.serializeTx(signedTx);

        return signedRawBytes;
    }

    static signTx(chainID, tx, privateKey) {
        let txRawBytes = tx.signBytes(chainID);
        let txHash = sha3(txRawBytes);
        let signature = sign(txHash, privateKey);
        tx.setSignature(signature);

        // console.log("signTx :: txRawBytes = " + txRawBytes);
        // console.log("signTx :: txHash = " + txHash);
        // console.log("signTx :: txSig = " + signature);

        return tx
    }

    static serializeTx(tx) {
        let encodedTxType = RLP.encode(Bytes.fromNumber(tx.getType()));
        let encodedTx = RLP.encode(tx.rlpInput()); // this time encode with signature
        let signedRawBytes = encodedTxType + encodedTx.slice(2);

        return signedRawBytes;
    }
}