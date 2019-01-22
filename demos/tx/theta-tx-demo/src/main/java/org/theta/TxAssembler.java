package org.theta;

import java.math.BigInteger;
import org.theta.types.SendTx;

public final class TxAssembler {

    public static SendTx assembleSendTx(byte[] fromAddr, byte[] toAddr, 
        BigInteger thetaWei, BigInteger gammaWei, BigInteger feeInGammaWei, long sequence) {
        SendTx sendTx = new SendTx(fromAddr, toAddr, thetaWei, gammaWei, feeInGammaWei, sequence);
        return sendTx;
    }

}