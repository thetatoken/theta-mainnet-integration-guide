import {Coins} from './coins';

export class TxOutput {
    constructor(address, thetaWei, tfuelWei) {
        this.address = address;
        this.coins = new Coins(thetaWei, tfuelWei);
    }

    rlpInput(){
        let rplInput = [
            this.address.toLowerCase(),
            this.coins.rlpInput()
        ];

        return rplInput;
    }
}