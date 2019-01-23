package org.theta;

import java.math.BigInteger;
import java.util.Arrays;
import org.ethereum.crypto.ECKey;
import org.ethereum.crypto.HashUtil;
import org.spongycastle.util.encoders.Hex;

public class App {

    final static int BatchSize = 100; 

    public static void main(String[] args) throws Exception {
        createAndValidateKeypairBatch();
    }

    // Reference: https://github.com/ethereum/ethereumj/blob/develop/ethereumj-core/src/main/java/org/ethereum/crypto/ECKey.java
    private static void createAndValidateKeypairBatch() throws Exception {
        for (int i = 0; i < BatchSize; i ++) {
            ECKey key = new ECKey();

            byte[] prik = key.getPrivKeyBytes();
            byte[] pubk = key.getPubKey();
            byte[] addr = key.getAddress();

            if (Hex.toHexString(prik).length() != 64) {
                continue; // to guarantee the private key is 256 bits long
            }
    
            String prikBase16   = "0x" + Hex.toHexString(prik);
            String pubkBase16   = "0x" + Hex.toHexString(pubk);
            String addrBase16   = "0x" + Hex.toHexString(addr);
            String addrWithCheckSum = toChecksumAddress((addrBase16));

            if (!validateAddress(addrBase16)) {
                throw new Exception(String.format("Invalid address: %s", addrBase16));
            }

            if (!validateAddress(addrWithCheckSum)) {
                throw new Exception(String.format("Invalid address with checksum: %s", addrWithCheckSum));
            }
                
            System.out.println("-------------------------------------------------------");
            System.out.println("Private Key: " + prikBase16);
            System.out.println("Public  Key: " + pubkBase16);
            System.out.println("Address    : " + addrBase16);
            System.out.println("Address(cs): " + addrWithCheckSum);
            System.out.println("-------------------------------------------------------");
            System.out.println("");
        }
    }

    // Reference: https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go#L2340
    private static String toChecksumAddress(String address) {
        address = address.toLowerCase().replaceAll("0x","");
        String addressHash = Hex.toHexString(HashUtil.sha3(address.toLowerCase().getBytes()));
        String checksumAddress = "0x";
        for (int i = 0; i < address.length(); i++) {
            String addri = address.substring(i, i+1);
            String hashi = addressHash.substring(i, i+1);       
            // If ith character is 8 to f then make it uppercase
            if (Integer.parseInt(hashi, 16) > 7) {
                checksumAddress += addri.toUpperCase();
            } else {
                checksumAddress += addri;
            }
        }
        return checksumAddress;
    }

    // Reference: https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go#L2288
    private static boolean validateAddress(String address) {
        // Must be a 20 bytes long hex string, the 0x prefix is optional
        if (!address.matches("^(0x)?[0-9a-fA-F]{40}$")) {
            return false;
        }

        // All lower case or upper case, considerred valid
        if (address.matches("^(0x)?[0-9a-f]{40}$") || address.matches("^(0x)?[0-9A-F]{40}$")) {
            return true;
        }
        
        // Otherwise check the mixed-case checksum per EIP-55
        return isAValidChecksumAddress(address);
    }

    // Reference: https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go#L2310
    private static boolean isAValidChecksumAddress(String address) {
        address = address.replaceAll("0x", "");
        final int expectedLength = 40;
        if (address.length() != expectedLength) {
            return false;
        }

        String addressHash = Hex.toHexString(HashUtil.sha3(address.toLowerCase().getBytes()));
        for (int i = 0; i < expectedLength; i++) {
            // the ith letter should be uppercase if the ith digit of casemap is 1
            String addri = address.substring(i, i+1);
            String hashi = addressHash.substring(i, i+1);
            if ((Integer.parseInt(hashi, 16) > 7 && addri.toUpperCase() != addri) || (Integer.parseInt(hashi, 16) <= 7 && addri.toLowerCase() != addri)) {
                return false;
            }
        }
        return true;
    }
}


