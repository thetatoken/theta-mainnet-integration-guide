import BigNumber from 'bignumber.js'

export const coinsSchema = {
  thetawei: { path: 'coins.thetawei', fn: x => { return new BigNumber(x) } },
  tfuelwei: { path: 'coins.tfuelwei', fn: x => { return new BigNumber(x) } }
}

export const sendPrerequistSchema = {
  sequence: { path: 'sequence', fn: x => { return new BigNumber(x) } },
  thetawei: { path: 'coins.thetawei', fn: x => { return new BigNumber(x) } },
  tfuelwei: { path: 'coins.tfuelwei', fn: x => { return new BigNumber(x) } }
}
