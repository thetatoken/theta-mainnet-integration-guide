package org.theta.tx.types;

import java.math.BigInteger;
import org.ethereum.util.RLP;

public final class Coins {
    
    public BigInteger thetaWei;
    public BigInteger gammaWei;

    public Coins(BigInteger thetaWei, BigInteger gammaWei) {
        this.thetaWei = thetaWei;
        this.gammaWei = gammaWei;
    }

    public byte[] rlpEncode() {
        byte[] rlpEncoded = RLP.encodeList(
            RLP.encode(this.thetaWei),
            RLP.encode(this.gammaWei));
        return rlpEncoded;
    }
}
