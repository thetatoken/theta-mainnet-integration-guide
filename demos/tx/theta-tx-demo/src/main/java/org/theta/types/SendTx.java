package org.theta.types;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.math.BigInteger;
import org.ethereum.util.RLP;

public final class SendTx {

    public Coins      fee;
    public TxInput[]  inputs;
    public TxOutput[] outputs;

    public SendTx(byte[] fromAddr, byte[] toAddr, BigInteger thetaWei, BigInteger gammaWei, BigInteger feeInGammaWei, long sequence) {
        this.fee = new Coins(BigInteger.valueOf(0), feeInGammaWei);

        TxInput txInput = new TxInput(fromAddr, thetaWei, gammaWei.add(feeInGammaWei), sequence);
        this.inputs = new TxInput[]{txInput};

        TxOutput txOutput = new TxOutput(toAddr, thetaWei, gammaWei);
        this.outputs = new TxOutput[]{txOutput};
    }

    public byte[] signBytes(String chainID) {
        // Detach the signatures from the inputs
        ArrayList<String> signatures = new ArrayList<String>();
        int numInputs = this.inputs.length;
        for (int i = 0; i < numInputs; i ++) {
            TxInput txInput = this.inputs[i];
            signatures.add(txInput.signature);
            txInput.signature = null;
        }

        // Serialize the transaction
        ByteBuffer byteBuf = ByteBuffer.wrap(new byte[]{});
        byteBuf.put(RLP.encode(chainID));
        byteBuf.put(RLP.encode(Constant.TxSend));
        byteBuf.put(RLP.encode(this));
        byte[] payload = byteBuf.array();

        EthereumTxWrapper ethTxWrapper = new EthereumTxWrapper(payload);
        byte[] signBytes = RLP.encode(ethTxWrapper);

        // Attach the signatures back to the inputs
        for (int i = 0; i < numInputs; i ++) {
            TxInput txInput = this.inputs[i];
            txInput.signature = signatures.get(i);
        }

        return signBytes;
    }
}
