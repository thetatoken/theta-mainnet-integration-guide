import AccountApi from '../../src/wallet/account/accountapi'
import QueryApi from '../../src/node/queryapi'
import { printToConsole } from '../testhelpers'

jest.setTimeout(15000)

const thetaRpcPort = 16888
const thetaCliRpcPort = 16889
const queryApi = new QueryApi(`http://localhost:${thetaRpcPort}/rpc`)
const accountApi = new AccountApi(`http://localhost:${thetaCliRpcPort}/rpc`)

it('Get Balance of all accounts', async () => {
  let accounts = await accountApi.ListKeys()

  let { addresses } = accounts

  printToConsole(addresses)

  for (const address of addresses) {
    try {
      const account = await queryApi.GetAccount(address)
      console.warn(`${address} | theta: ${account.coins.thetawei} | tfuel: ${account.coins.tfuelwei}`)
    } catch (error) {
      console.error(error)
    }
  }
})
