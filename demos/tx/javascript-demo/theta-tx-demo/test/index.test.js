const BigNumber = require('bignumber.js');
const thetajs = require('..');
const SendTx = thetajs.SendTx;
const TxSigner = thetajs.TxSigner;
const Utils = thetajs.Utils;

const chainID = "testnet";

function createSendTx(){
    const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1 Theta = 10^18 ThetaWei, 1 Gamma = 10^ TFuelWei
    const thetaWeiToSend = (new BigNumber(2)).multipliedBy(ten18);
    const tfuelWeiToSend = (new BigNumber(3)).multipliedBy(ten18);
    const feeInTFuelWei  = (new BigNumber(10)).pow(12); // Any fee >= 10^12 TFuelWei should work, higher fee yields higher priority
    const senderAddr =  "0x59c32D1F9fF59FE524aaA34B703C0aC8Fad4d4d0";
    const receiverAddr = "0xB91f6163E6f1A60b6d932dcD1C190BD364e0df05";
    const senderSequence = 1; //TODO: this should be dynamic, similar to the "nonce" parameter for Ethereum

    let tx = new SendTx(senderAddr, receiverAddr, thetaWeiToSend, tfuelWeiToSend, feeInTFuelWei, senderSequence);

    console.log("Assembled a SendTx transaction\n\tfrom   : " + senderAddr + "\n\tto     : " + receiverAddr 
        + "\n\tamount : " + thetaWeiToSend + " ThetaWei, " + tfuelWeiToSend + " TFuelWei"
        + "\n\tfee    : " + feeInTFuelWei + " TFuelWei"
        + "\n\tseq    : " + senderSequence)

    return tx;
}

test('should sign and serialize a SendTx', () => {
    // hard-coded privateKey for testing purposes only :)
    let privateKey = "0xc88b2d8a81ceea76b41e005556c1c77c0062a5ba0566a1fe214770f485adde4f";
    let sendTx = createSendTx();

    const signedRawTxBytes = TxSigner.signAndSerializeTx(chainID, sendTx, privateKey);

    console.log("SignedRawTxBytes: " + signedRawTxBytes.toString('hex'));

    expect(signedRawTxBytes).not.toBe(null);
});