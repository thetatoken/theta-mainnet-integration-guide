package org.theta.signer;

import java.math.BigInteger;
import org.ethereum.crypto.ECKey;
import org.ethereum.crypto.HashUtil;
import org.ethereum.util.RLP;
import org.spongycastle.util.Arrays;
import org.spongycastle.util.encoders.Hex;
import org.theta.tx.types.Tx;

public final class TxSigner {
    
    //
    // WARNING: for simplicity, in this demo we hardcode the private key below. 
    //          NEVER do this in the production code!!!
    //
    //                  uuuuuuu
    //              uu$$$$$$$$$$$uu                     SECRET LEAKED...
    //           uu$$$$$$$$$$$$$$$$$uu              LOL LOL L..
    //          u$$$$$$$$$$$$$$$$$$$$$u         LOL LOL
    //         u$$$$$$$$$$$$$$$$$$$$$$$u    hiahia
    //        u$$$$$$$$$$$$$$$$$$$$$$$$$u
    //        u$$$$$$$$$$$$$$$$$$$$$$$$$u
    //        u$$$$$$"   "$$$"   "$$$$$$u
    //        "$$$$"      u$u       $$$$"
    //         $$$u       u$u       u$$$
    //         $$$u      u$$$u      u$$$
    //          "$$$$uu$$$   $$$uu$$$$"
    //           "$$$$$$$"   "$$$$$$$"
    //             u$$$$$$$u$$$$$$$u
    //              u$"$"$"$"$"$"$u
    //   uuu        $$ $ L O L $ $$       uuu
    private final static String PRIVATE_KEY_STRING = "93a90ea508331dfdf27fb79757d4250b4e84954927ba0073cd67454ac432c737"; 
    //  u$$$$        $$$ u  L u$$$       u$$$$
    //   $$$$$uu      "$$$$$$$$$"     uu$$$$$$      
    // u$$$$$$$$$$$uu    """""    uuuu$$$$$$$$$$
    // $$$$"""$$$$$$$$$$uuu   uu$$$$$$$$$"""$$$"
    //  """      ""$$$$$$$$$$$uu ""$"""
    //            uuuu ""$$$$$$$$$$uuu
    //   u$$$uuu$$$$$$$$$uu ""$$$$$$$$$$$uuu$$$
    //   $$$$$$$$$$""""           ""$$$$$$$$$$$"
    //    "$$$$$"                      ""$$$$""
    //      $$$"                         $$$$"
    //

    public static byte[] getSignedRawTxBytes(String chainID, Tx tx) throws Exception {
        byte[] txRawBytes = tx.signBytes(chainID);
        byte[] signature = TxSigner.sign(txRawBytes);
        tx.setSignature(signature);

        byte[] signedRawBytes = new byte[0];
        signedRawBytes = Arrays.concatenate(signedRawBytes, RLP.encode(tx.getType()));
        signedRawBytes = Arrays.concatenate(signedRawBytes, tx.rlpEncode()); // this time encode with signature

        return signedRawBytes;
    }

    private static byte[] sign(byte[] rawTxBytes) throws Exception {
        BigInteger privateKey = new BigInteger(Hex.decode(TxSigner.PRIVATE_KEY_STRING));
        ECKey key = ECKey.fromPrivate(privateKey);
        byte[] txHash = HashUtil.sha3(rawTxBytes);
        byte[] signature = key.sign(txHash).toByteArray();

        System.out.printf(">>>>>>>>> txHash: %s\n", org.apache.commons.codec.binary.Hex.encodeHexString(txHash));
        System.out.printf(">>>>>>>>> Address: %s\n", org.apache.commons.codec.binary.Hex.encodeHexString(key.getAddress()));

        return signature;
    }

}