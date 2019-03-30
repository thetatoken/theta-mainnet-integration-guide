import TxApi from '../../src/wallet/tx/txapi'
import AccountApi from '../../src/wallet/account/accountapi'
import QueryApi from '../../src/node/queryapi'
import SendParameters from '../../src/wallet/tx/types/sendparameters'
import BigNumber from 'bignumber.js'
import { printToConsole } from '../testhelpers'
import { coinsSchema, sendPrerequistSchema } from '../../src/wallet/schemas/accountschemas'
import delay from 'delay'

jest.setTimeout(20000)

const thetaRpcPort = 16888
const thetaCliRpcPort = 16889
const queryApi = new QueryApi(`http://localhost:${thetaRpcPort}/rpc`)
const accountApi = new AccountApi(`http://localhost:${thetaCliRpcPort}/rpc`)
const underTest = new TxApi(`http://localhost:${thetaCliRpcPort}/rpc`)

// hard-coded privateKey for testing purposes only
const password = 'qwertyuiop'
const senderAddr = '0x2E833968E5bB786Ae419c4d13189fB081Cc43bab'
const receiverAddr = '0x0d2fd67d573c8ecb4161510fc00754d64b401f86'

const ten18 = (new BigNumber(10)).pow(18) // 10^18, 1 Theta = 10^18 ThetaWei, 1 Gamma = 10^ TFuelWei
const thetaWei = (new BigNumber(2)).multipliedBy(ten18)
const tfuelWei = (new BigNumber(3)).multipliedBy(ten18)
const feeInTFuelWei = (new BigNumber(10)).pow(12) // Any fee >= 10^12 TFuelWei should work, higher fee yields higher priority

afterAll(async () => {
  // sent back the coins
  await accountApi.UnlockKey(receiverAddr, password)
  let account = await queryApi.GetAccount(receiverAddr, sendPrerequistSchema)
  let sendQuery = new SendParameters('privatenet', receiverAddr, senderAddr, thetaWei.multipliedBy(2), tfuelWei.multipliedBy(2), feeInTFuelWei, account.sequence.plus(1), true)
  await underTest.Send(sendQuery)
})

it('send tx', async (done) => {
  let toAccount
  try {
    toAccount = await queryApi.GetAccount(receiverAddr, coinsSchema)
  } catch (error) {
    if (error.message.search('not found')) {
      toAccount = {}
      toAccount.tfuelwei = 0
      toAccount.thetaWei = 0
    }
  }

  let fromAccount = await queryApi.GetAccount(senderAddr, sendPrerequistSchema)
  let sendQuery = new SendParameters('privatenet', senderAddr, receiverAddr, thetaWei, tfuelWei, feeInTFuelWei, fromAccount.sequence.plus(1), false)
  await accountApi.UnlockKey(senderAddr, password)
  let actual = await underTest.Send(sendQuery)

  printToConsole('send tx', actual)

  let {
    hash,
    block: {
      ChainID,
      Epoch,
      Height,
      Parent,
      HCC: {
        Votes,
        BlockHash
      },
      TxHash,
      StateHash,
      Timestamp,
      Proposer,
      Signature

    }
  } = actual

  expect(hash).toBeDefined()
  expect(ChainID).toBe('privatenet')
  expect(Epoch).toBeDefined()
  expect(Height).toBeDefined()
  expect(Parent).toBeDefined()
  expect(Votes).toBeDefined()
  expect(BlockHash).toBeDefined()
  expect(TxHash).toBeDefined()
  expect(StateHash).toBeDefined()
  expect(Timestamp).toBeDefined()
  expect(Proposer).toBeDefined()
  expect(Signature).toBeDefined()

  let newFromBalance = await queryApi.GetAccount(senderAddr, coinsSchema)
  let newToBalance = await queryApi.GetAccount(receiverAddr, coinsSchema)

  expect(newFromBalance.thetawei).toEqual(fromAccount.thetawei.minus(thetaWei))
  expect(newFromBalance.tfuelwei).toEqual(fromAccount.tfuelwei.minus(tfuelWei).minus(feeInTFuelWei))

  expect(newToBalance.thetawei).toEqual(toAccount.thetawei.plus(thetaWei))
  expect(newToBalance.tfuelwei).toEqual(toAccount.tfuelwei.plus(tfuelWei))

  done()
})

it('send async tx', async (done) => {
  let toAccount
  try {
    toAccount = await queryApi.GetAccount(receiverAddr, coinsSchema)
  } catch (error) {
    if (error.message.search('not found')) {
      toAccount = {}
      toAccount.tfuelwei = 0
      toAccount.thetaWei = 0
    }
  }

  let fromAccount = await queryApi.GetAccount(senderAddr, sendPrerequistSchema)
  let sendQuery = new SendParameters('privatenet', senderAddr, receiverAddr, thetaWei, tfuelWei, feeInTFuelWei, fromAccount.sequence.plus(1), true)
  await accountApi.UnlockKey(senderAddr, password)
  let actual = await underTest.Send(sendQuery)

  printToConsole('send async tx', actual)

  let { hash } = actual

  expect(hash).toBeDefined()

  try {
    let result = await queryApi.GetTransaction(hash)

    do {
      result = await queryApi.GetTransaction(hash)
      await delay(1500)
      printToConsole(`transaction status ${new Date().toLocaleTimeString()}`, result.status)
    } while (result.status !== 'finalized')
  } catch (error) {
    console.error(error)
  }

  let newFromBalance = await queryApi.GetAccount(senderAddr, coinsSchema)
  let newToBalance = await queryApi.GetAccount(receiverAddr, coinsSchema)

  expect(newFromBalance.thetawei).toEqual(fromAccount.thetawei.minus(thetaWei))
  expect(newFromBalance.tfuelwei).toEqual(fromAccount.tfuelwei.minus(tfuelWei).minus(feeInTFuelWei))

  expect(newToBalance.thetawei).toEqual(toAccount.thetawei.plus(thetaWei))
  expect(newToBalance.tfuelwei).toEqual(toAccount.tfuelwei.plus(tfuelWei))

  done()
})
z