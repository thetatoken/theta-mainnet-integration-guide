package org.theta.tx.types;

import java.math.BigInteger;
import org.spongycastle.util.encoders.Hex;
import org.ethereum.util.RLP;

public final class EthereumTxWrapper {
    long       nonce;
    BigInteger gasPrice;
    long       gas; // gas limit
    byte[]     to;
    BigInteger value;
    byte[]     input; // the payload

    public EthereumTxWrapper(byte[] payload) throws Exception {
        this.nonce = 0;
        this.gasPrice = BigInteger.valueOf(0);
        this.gas = 0;
        this.to = Hex.decode("0000000000000000000000000000000000000000");
        this.value = BigInteger.valueOf(0);
        this.input = payload;
    }

    public byte[] rlpEncode() {
        byte[] rlpEncoded = RLP.encodeList(
            RLP.encode(this.nonce),
            RLP.encode(this.gasPrice),
            RLP.encode(this.gas),
            RLP.encode(this.to),
            RLP.encode(this.value),
            RLP.encode(this.input));
        return rlpEncoded;
    }
}