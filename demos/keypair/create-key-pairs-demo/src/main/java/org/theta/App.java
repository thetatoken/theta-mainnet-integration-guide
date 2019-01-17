package org.theta;

import org.ethereum.crypto.ECKey;
import org.spongycastle.util.encoders.Hex;

public class App {

    final static int BatchSize = 100; 

    public static void main(String[] args) {
        for (int i = 0; i < BatchSize; i ++) {
            ECKey key = new ECKey();

            byte[] prik = key.getPrivKeyBytes();
            byte[] pubk = key.getPubKey();
            byte[] addr = key.getAddress();
    
            String prikBase16 = Hex.toHexString(prik);
            String pubkBase16 = Hex.toHexString(pubk);
            String addrBase16 = Hex.toHexString(addr);
    
            System.out.println("--------------------------------------------------");
            System.out.println("Private Key: " + prikBase16);
            System.out.println("Public  Key: " + pubkBase16);
            System.out.println("Address    : " + addrBase16);
            System.out.println("--------------------------------------------------");
            System.out.println("");
        }
    }
}


