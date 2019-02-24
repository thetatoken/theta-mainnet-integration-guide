import {Coins} from './coins'
import Bytes from 'eth-lib/lib/bytes';

export class TxInput{
    constructor(address, thetaWei, tfuelWei, sequence) {
        this.address = address;
        this.coins = new Coins(thetaWei, tfuelWei);
        this.sequence = sequence;
        this.signature = "";
    }

    setSignature(signature) {
        this.signature = signature;
    }

    rlpInput(){
        let rplInput = [
            this.address.toLowerCase(),
            this.coins.rlpInput(),
            Bytes.fromNumber(this.sequence),
            this.signature
        ];

        return rplInput;
    }
}