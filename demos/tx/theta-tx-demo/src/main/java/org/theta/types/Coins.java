package org.theta.types;

import java.math.BigInteger;

public final class Coins {
    
    public BigInteger thetaWei;
    public BigInteger gammaWei;

    public Coins(BigInteger thetaWei, BigInteger gammaWei) {
        this.thetaWei = thetaWei;
        this.gammaWei = gammaWei;
    }
}
