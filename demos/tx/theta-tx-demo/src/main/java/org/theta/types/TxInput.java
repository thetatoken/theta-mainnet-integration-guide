package org.theta.types;

import java.math.BigInteger;

public final class TxInput {

    public byte[] address;
    public Coins  coins;
    public long   sequence;
    public String signature;

    public TxInput(byte[] address, BigInteger thetaWei, BigInteger gammaWei, long sequence) {
        this.address = address;
        this.coins = new Coins(thetaWei, gammaWei);
        this.sequence = sequence;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }
}
