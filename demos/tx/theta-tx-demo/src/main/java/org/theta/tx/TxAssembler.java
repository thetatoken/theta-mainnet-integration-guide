package org.theta.tx;

import java.math.BigInteger;

import org.spongycastle.util.encoders.Hex;
import org.theta.tx.types.SendTx;

public final class TxAssembler {

    public static SendTx assembleSendTx(String senderAddr, String receiverAddr, 
        BigInteger thetaWei, BigInteger gammaWei, BigInteger feeInGammaWei, long senderSequence) {
        SendTx sendTx = new SendTx(Hex.decode(senderAddr), Hex.decode(receiverAddr), thetaWei, gammaWei, feeInGammaWei, senderSequence);
        return sendTx;
    }

}