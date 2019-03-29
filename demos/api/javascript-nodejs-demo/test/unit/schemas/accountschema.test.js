import { coinsSchema, sendPrerequistSchema } from '../../../src/wallet/schemas/accountschemas'
import { morphism } from 'morphism'

const response = {
  jsonrpc: '2.0',
  id: 1,
  result: {
    sequence: '1',
    coins: {
      thetawei: '994999990000000000000000000',
      tfuelwei: '4999999979999999000000000000'
    },
    reserved_funds: [],
    last_updated_block_height: '0',
    root: '0x0000000000000000000000000000000000000000000000000000000000000000',
    code: '0x0000000000000000000000000000000000000000000000000000000000000000'
  }
}
it('map to account coins', () => {
  let result = morphism(coinsSchema, response.result)
  let { thetawei, tfuelwei } = result

  expect(thetawei.toNumber()).toBe(994999990000000000000000000)
  expect(tfuelwei.toNumber()).toBe(4999999979999999000000000000)
})

it('map to account sequence and coins', () => {
  let result = morphism(sendPrerequistSchema, response.result)
  let { sequence, thetawei, tfuelwei } = result

  expect(sequence.toNumber()).toBe(1)
  expect(thetawei.toNumber()).toBe(994999990000000000000000000)
  expect(tfuelwei.toNumber()).toBe(4999999979999999000000000000)
})
