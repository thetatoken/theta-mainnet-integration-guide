package org.theta.tx.types;

public interface Tx {
    
    public void setSignature(byte[] signature) throws Exception;

    public byte[] signBytes(String chainID) throws Exception;

    public long getType();

    public byte[] rlpEncode();
}