package org.theta.tx.types;

import java.math.BigInteger;
import org.ethereum.util.RLP;

public final class Coins {
    
    public BigInteger thetaWei;
    public BigInteger tfuelWei;

    public Coins(BigInteger thetaWei, BigInteger tfuelWei) {
        this.thetaWei = thetaWei;
        this.tfuelWei = tfuelWei;
    }

    public byte[] rlpEncode() {
        byte[] rlpEncoded = RLP.encodeList(
            RLP.encode(this.thetaWei),
            RLP.encode(this.tfuelWei));
        return rlpEncoded;
    }
}
