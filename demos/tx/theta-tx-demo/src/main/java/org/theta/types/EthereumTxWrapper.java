package org.theta.types;

import java.math.BigInteger;

public final class EthereumTxWrapper {
    long       nonce;
    BigInteger gasPrice;
    long       gas; // gas limit
    byte[]     to;
    BigInteger value;
    byte[]     input; // the payload

    public EthereumTxWrapper(byte[] payload) {
        this.nonce = 0;
        this.gasPrice = BigInteger.valueOf(0);
        this.gas = 0;
        this.to = new byte[]{};
        this.value = BigInteger.valueOf(0);
        this.input = payload;
    }
}