package org.theta.tx.types;

import java.math.BigInteger;
import org.ethereum.util.RLP;

public final class TxOutput {

    public byte[] address;
    public Coins  coins;

    public TxOutput(byte[] address, BigInteger thetaWei, BigInteger tfuelWei) {
        this.address = address;
        this.coins = new Coins(thetaWei, tfuelWei);
    }

    public byte[] rlpEncode() {
        byte[] rlpEncoded = RLP.encodeList(
            RLP.encode(this.address),
            this.coins.rlpEncode());
        return rlpEncoded;
    }
}