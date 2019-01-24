package org.theta.tx.types;

import java.math.BigInteger;
import org.ethereum.util.RLP;

public final class TxInput {

    public byte[] address;
    public Coins  coins;
    public long   sequence;
    public byte[] signature;

    public TxInput(byte[] address, BigInteger thetaWei, BigInteger tfuelWei, long sequence) {
        this.address = address;
        this.coins = new Coins(thetaWei, tfuelWei);
        this.sequence = sequence;
        this.signature = new byte[0];
    }

    public void setSignature(byte[] signature) {
        this.signature = signature;
    }

    public byte[] rlpEncode() {
        byte[] rlpEncoded = RLP.encodeList(
            RLP.encode(this.address),
            this.coins.rlpEncode(),
            RLP.encode(this.sequence),
            RLP.encode(this.signature));
        return rlpEncoded;
    }
}
