import Bytes from 'eth-lib/lib/bytes';
import BigNumber from 'bignumber.js';

export class Coins{
    constructor(thetaWei, tfuelWei){
        this.thetaWei = thetaWei;
        this.tfuelWei = tfuelWei;
    }

    rlpInput(){

        let rlpInput = [
            (this.thetaWei.isEqualTo(new BigNumber(0))) ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.thetaWei),
            (this.tfuelWei.isEqualTo(new BigNumber(0))) ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.tfuelWei)
        ];

        return rlpInput;
    }
}