import SendParameters from '../../../src/wallet/tx/types/sendparameters'

it('init send parameters', () => {
  try {
    let { chain_id, from, to, thetaWei, tfuelWei, fee, sequence, async } =
    new SendParameters('privatenet', '0x0d2fd67d573c8ecb4161510fc00754d64b401f81', '0x0d2fd67d573c8ecb4161510fc00754d64b401f86', 1, 2, 3, 4, true)

    expect(chain_id).toBe('privatenet')
    expect(from).toBe('0x0d2fd67d573c8ecb4161510fc00754d64b401f81')
    expect(to).toBe('0x0d2fd67d573c8ecb4161510fc00754d64b401f86')
    expect(thetaWei).toBe('1')
    expect(tfuelWei).toBe('2')
    expect(fee).toBe('3')
    expect(sequence).toBe('4')
    expect(async).toBe(true)
  } catch (error) {
    console.warn(error)
  }
})

it('validate from address', () => {
  try {
    let actual = new SendParameters('', 'not good', '0x0d2fd67d573c8ecb4161510fc00754d64b401f86', 1, 2, 3, 4, true)
  } catch (error) {
    expect(error[0].constraints.isWalletAddress).toBe('Is not a valid wallet address')
    expect(error[0].property).toBe('from')
  }
})

it('validate to address', () => {
  try {
    let actual = new SendParameters('', '0x0d2fd67d573c8ecb4161510fc00754d64b401f86', 'not good', 1, 2, 3, 4, true)
  } catch (error) {
    expect(error[0].constraints.isWalletAddress).toBe('Is not a valid wallet address')
    expect(error[0].property).toBe('to')
  }
})
