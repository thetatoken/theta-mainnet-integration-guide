import jayson from 'jayson/promise'
import { responseExtractor } from '../helpers/responseExtractor'

// API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#api-reference

// Before running this demo, please follow the steps in the setup guide to launch a local private net
// Setup guide: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/setup.md#setup
export default class QueryApi {
  constructor (rpcURL) {
    this.rpc_url = rpcURL
    this.client = jayson.client.http(this.rpc_url)
  }

  // --------------- Get version of the Blockchain ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getversion
  async GetVersion (schema) {
    try {
      let response = await this.client.request('theta.GetVersion', [])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Get the Status of the Blockchain ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getstatus
  async GetStatus (schema) {
    try {
      let response = await this.client.request('theta.GetStatus', [])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
    }
  }

  // ---------------------- Retrieve an account ---------------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getaccount
  async GetAccount (address, schema) {
    try {
      let response = await this.client.request('theta.GetAccount', [{ address: address }])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // ------------- Get a block with the given block hash ------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getblock
  async GetBlock (hash, schema) {
    try {
      let response = await this.client.request('theta.GetBlock', [{ hash: hash }])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // ---------------- Get a block at the given height ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getblockbyheight
  async GetBlockByHeight (height, schema) {
    try {
      let response = await this.client.request('theta.GetBlockByHeight', [{ height: height.toString() }])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
    }
  }

  // ------- Get a transaction with the given transaction hash ------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#gettransaction
  async GetTransaction (hash, schema) {
    try {
      let response = await this.client.request('theta.GetTransaction', [{ hash: hash }])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // ------- Get pending transactions ------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getpendingtransactions
  async GetPendingTransactions (schema) {
    try {
      let response = await this.client.request('theta.GetPendingTransactions', [])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
