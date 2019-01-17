import org.ethereum.crypto.ECKey;
import org.spongycastle.util.encoders.Hex;

public class CreateAccount {

    public static void main(String[] args) {
        ECKey key = new ECKey();

        byte[] addr = key.getAddress();
        byte[] priv = key.getPrivKeyBytes();

        String addrBase16 = Hex.toHexString(addr);
        String privBase16 = Hex.toHexString(priv);

        System.out.println("Address     : " + addrBase16);
        System.out.println("Private Key : " + privBase16);
    }
}

