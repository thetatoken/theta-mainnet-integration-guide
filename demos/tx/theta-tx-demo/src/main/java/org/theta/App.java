package org.theta;

import java.math.BigInteger;

import org.apache.commons.codec.binary.Hex;
import org.ethereum.util.RLP;
import org.json.JSONObject;
import org.theta.tx.types.SendTx;
import org.theta.tx.TxAssembler;
import org.theta.signer.TxSigner;
import org.theta.broadcaster.RawTxBroadcaster;
import org.theta.common.RPC;

public final class App {
    
    private static RPC rpc;

    // This program includes three demos: 1) Construct a transaction, 2) sign the transaction, and 3) broadcast
    // the signed transaction to the blockchain. For convenience, we have combined the three demos into one program.
    // However, we note that each demo can be easily modified to be a standalone program. In particular, the second demo 
    // (transaction signing) can be run on an OFFLINE computer to sign the transaction in a more secure evironment.

    // Before running this demo, please follow the steps in the setup guide to launch a local private net
    // Setup guide: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/setup.md#setup 
     public static void main(String[] args) throws Exception {        
        String rpcUrl = "http://localhost:16888/rpc"; // can point to any Theta node
        App.rpc = new RPC(rpcUrl);

        String chainID      = "private_net"; // Only for the private net launched followig the setup guide, different chain should have different chainID
        String senderAddr   = "2E833968E5bB786Ae419c4d13189fB081Cc43bab";
        String receiverAddr = "9F1233798E905E173560071255140b4A8aBd3Ec6";

        System.out.println("");
        System.out.println("-------- Account Balances before the SendTx --------\n");
        App.printAccountBalance(senderAddr);
        App.printAccountBalance(receiverAddr);
        System.out.println("----------------------------------------------------");
        System.out.println("");

        // ----------------- Demo #1: Construct a Transaction ----------------- //

        // This demo illustrates how to construct a SendTx to send tokens from one address to another.
        // A SendTx transaction can send both Theta and Gamma tokens in one shot.
        BigInteger ten18 = BigInteger.valueOf(10).pow(18); // 10^18, 1 Theta = 10^18 ThetaWei, 1 Gamma = 10^ GammaWei
        BigInteger thetaWeiToSend = BigInteger.valueOf(10).multiply(ten18);
        BigInteger gammaWeiToSend = BigInteger.valueOf(20).multiply(ten18);
        BigInteger feeInGammaWei = BigInteger.valueOf(10).pow(12); // Any fee >= 10^12 GammaWei should work, higher fee yields higher priority
        long senderSequence = App.getAccountSequence(senderAddr) + 1; // similar to the "nonce" parameter in Ethereum transaction
        SendTx sendTx = TxAssembler.assembleSendTx(senderAddr, receiverAddr, thetaWeiToSend, gammaWeiToSend, feeInGammaWei, senderSequence);

        System.out.printf("SendTx signBytes    : %s\n\n", Hex.encodeHexString(sendTx.signBytes(chainID)));
        System.out.printf("fee signBytes       : %s\n\n", Hex.encodeHexString(sendTx.fee.rlpEncode()));
        System.out.printf("Inputs          xxx : %s\n\n", Hex.encodeHexString(RLP.encodeList(sendTx.inputs[0].rlpEncode())));
        System.out.printf("Inputs[0] signBytes : %s\n\n", Hex.encodeHexString(sendTx.inputs[0].rlpEncode()));
        System.out.printf("Inputs[0].coins     : %s\n\n", Hex.encodeHexString(sendTx.inputs[0].coins.rlpEncode()));
        System.out.printf("Inputs[0].address   : %s\n\n", Hex.encodeHexString(RLP.encode(sendTx.inputs[0].address)));
        System.out.printf("Outputs[0] signBytes: %s\n\n", Hex.encodeHexString(sendTx.outputs[0].rlpEncode()));
        System.out.printf("Outputs[0].coins    : %s\n\n", Hex.encodeHexString(sendTx.outputs[0].coins.rlpEncode()));

        // ----------------- Demo #2: Sign the Transaction -------------------- //
     
        // This demo illustrates how to serialize and sign the transaction.
        byte[] signedRawTxBytes = TxSigner.getSignedRawTxBytes(chainID, sendTx);

        System.out.printf("Sender Signature    : %s\n\n", Hex.encodeHexString(sendTx.inputs[0].signature));
        System.out.printf("Signed SendTx       : %s\n\n", Hex.encodeHexString(signedRawTxBytes));

        // --------------- Demo #3: Broadcast the Transaction ----------------- //

        // This demo illustrate how to broadcast the signed raw transaction to the blockchain.
        // This may take a couple seconds, since the "theta.BroadcastRawTransaction" RPC call
        // is a synchronized call, i.e., it will wait until the transaction got included in the
        // blockchain, or a timeout reached.
        RawTxBroadcaster.setRPC(App.rpc);
        RawTxBroadcaster.broadcast(signedRawTxBytes);

        // --------------------------------------------------------------------- //

        System.out.println("");
        System.out.println("-------- Account Balances after the SendTx ---------\n");
        App.printAccountBalance(senderAddr);
        App.printAccountBalance(receiverAddr);
        System.out.println("----------------------------------------------------");
        System.out.println("");
    }

    private static long getAccountSequence(String address) throws Exception {
        String rpcMethod = "theta.GetAccount";
        JSONObject params = new JSONObject();
        params.put("address", address);
        JSONObject getAccountResult = App.rpc.call(rpcMethod, params);
        long sequence = getAccountResult.getJSONObject("result").getLong("sequence");

        System.out.printf("Sequence of %s: %s\n\n", address, sequence);

        return sequence;
    }

    private static void printAccountBalance(String address) throws Exception {
        String rpcMethod = "theta.GetAccount";
        JSONObject params = new JSONObject();
        params.put("address", address);
        JSONObject getAccountResult = App.rpc.call(rpcMethod, params);
        JSONObject coinsJSON = getAccountResult.getJSONObject("result").getJSONObject("coins");
        BigInteger thetaWei = coinsJSON.getBigInteger("thetawei");
        BigInteger gammaWei = coinsJSON.getBigInteger("gammawei");

        System.out.printf("Balance of %s:\n\tthetaWei = %s\n\tgammaWei = %s\n\n", address, thetaWei, gammaWei);
    }
}
