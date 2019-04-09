import jayson from 'jayson/promise'
import { responseExtractor } from '../../helpers/responseExtractor'

// API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#api-reference

// Before running this demo, please follow the steps in the setup guide to launch a local private net
// Setup guide: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/setup.md#setup
export default class TxApi {
  constructor (rpcURL) {
    this.rpc_url = rpcURL
    this.client = jayson.client.http(this.rpc_url)
  }

  // --------------- Sends the Theta/TFuel tokens ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#send
  async Send (sendQuery, schema) {
    try {
      let response = await this.client.request('thetacli.Send', [sendQuery])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
