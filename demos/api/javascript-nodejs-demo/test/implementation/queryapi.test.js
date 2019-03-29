import QueryApi from '../../src/node/queryapi'
import { printToConsole } from '../testhelpers'

const underTest = new QueryApi('http://localhost:16888/rpc')
const address = '0x2E833968E5bB786Ae419c4d13189fB081Cc43bab'
let transaction
let block
let blockHeight

it('get version', async () => {
  let actual = await underTest.GetVersion()

  printToConsole('get version', actual)

  let {
    version,
    git_hash,
    timestamp
  } = actual

  expect(version).toBeDefined()
  expect(git_hash).toBeDefined()
  expect(timestamp).toBeDefined()
})

it('get account', async () => {
  let actual = await underTest.GetAccount(address)

  printToConsole('get account', actual)

  let {
    sequence,
    coins: {
      thetawei,
      tfuelwei },
    reserved_funds,
    last_updated_block_height,
    root,
    code
  } = actual

  expect(sequence).toBeDefined()
  expect(thetawei).toBeDefined()
  expect(tfuelwei).toBeDefined()
  expect(reserved_funds).toBeInstanceOf(Array)
  expect(last_updated_block_height).toBeDefined()
  expect(root).toBeDefined()
  expect(code).toBeDefined()
})

it('get account with shema', async () => {
  const coins = {
    thetawei: 'coins.thetawei',
    tfuelwei: 'coins.tfuelwei'
  }

  let actual = await underTest.GetAccount(address, coins)

  printToConsole('get account with schema', actual)

  let {
    thetawei,
    tfuelwei
  } = actual

  expect(thetawei).toBeDefined()
  expect(tfuelwei).toBeDefined()
})

it('get status', async () => {
  let actual = await underTest.GetStatus()

  printToConsole('get status', actual)

  let {
    latest_finalized_block_hash,
    latest_finalized_block_height,
    latest_finalized_block_time,
    latest_finalized_block_epoch,
    current_epoch,
    current_time,
    syncing
  } = actual

  // set values for other tests
  block = latest_finalized_block_hash
  blockHeight = latest_finalized_block_height

  expect(latest_finalized_block_hash).toBeDefined()
  expect(latest_finalized_block_height).toBeDefined()
  expect(latest_finalized_block_time).toBeDefined()
  expect(latest_finalized_block_epoch).toBeDefined()
  expect(current_epoch).toBeDefined()
  expect(current_time).toBeDefined()
  expect(syncing).toBeDefined()
})

it('get block', async () => {
  let actual = await underTest.GetBlock(block)

  // set value for 'get transaction test'
  transaction = actual.transactions[0].hash

  printToConsole('get block', actual)

  expectCombined(actual)
})

it('get block by height', async () => {
  let actual = await underTest.GetBlockByHeight(blockHeight)

  printToConsole('get block by height', actual)

  expect(actual)
})

function expectCombined (actual) {
  let { chain_id, epoch, height, parent, transactions_hash, state_hash, timestamp, proposer, children, status, hash, transactions } = actual
  expect(chain_id).toBe('privatenet')
  expect(epoch).toBeDefined()
  expect(height).toBeDefined()
  expect(parent).toBeDefined()
  expect(transactions_hash).toBeDefined()
  expect(state_hash).toBeDefined()
  expect(timestamp).toBeDefined()
  expect(proposer).toBeDefined()
  expect(children).toBeDefined()
  expect(status).toBeDefined()
  expect(hash).toBeDefined()
  expect(transactions).toBeDefined()
}

it('get transaction', async () => {
  let actual = await underTest.GetTransaction(transaction)

  printToConsole('get transaction ', actual)

  let {
    block_hash,
    block_height,
    status,
    transaction: {
      fee,
      proposer,
      inputs,
      outputs

    } } = actual

  expect(block_hash).toBeDefined()
  expect(block_height).toBeDefined()
  expect(status).toBeDefined()

  expect(proposer.address).toBeDefined()
  expect(proposer.coins.thetawei).toBeDefined()
  expect(proposer.coins.tfuelwei).toBeDefined()
  expect(proposer.sequence).toBeDefined()
  expect(proposer.signature).toBeDefined()

  expect(outputs[0].address).toBeDefined()
  expect(outputs[0].coins.thetawei).toBeDefined()
  expect(outputs[0].coins.tfuelwei).toBeDefined()
})

it('get pending transactions', async () => {
  let actual = await underTest.GetPendingTransactions()

  printToConsole('get pending transactions', actual)

  let { tx_hashes } = actual

  expect(tx_hashes).toBeInstanceOf(Array)
})
