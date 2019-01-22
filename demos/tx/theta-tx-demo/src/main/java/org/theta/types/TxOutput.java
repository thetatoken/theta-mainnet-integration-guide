package org.theta.types;

import java.math.BigInteger;

public final class TxOutput {

    public byte[] address;
    public Coins  coins;

    public TxOutput(byte[] address, BigInteger thetaWei, BigInteger gammaWei) {
        this.address = address;
        this.coins = new Coins(thetaWei, gammaWei);
    }
}