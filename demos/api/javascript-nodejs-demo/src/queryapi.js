import jayson from 'jayson/promise'

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
  async GetVersion () {
    try {
      return this.client.request('theta.GetVersion', [])
    } catch (error) {
      console.error(error)
    }
  }

  // --------------- Get the Status of the Blockchain ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getstatus
  async GetStatus () {
    try {
      return this.client.request('theta.GetStatus', [])
    } catch (error) {
      console.error(error)
    }
  }

  // ---------------------- Retrieve an account ---------------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getaccount
  async GetAccount (address) {
    try {
      return this.client.request('theta.GetAccount', [{ address: address }])
    } catch (error) {
      console.error(error)
    }
  }
    
  // ------------- Get a block with the given block hash ------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getblock
  async GetBlock (hash) {
    try {
      return this.client.request('theta.GetBlock', [{ hash: hash }])
    } catch (error) {
      console.error(error)
    }
  }
  
  // ---------------- Get a block at the given height ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getblockbyheight
  async GetBlockByHeight (height) {
    try {
      return this.client.request('theta.GetBlockByHeight', [{ height: height.toString() }])
    } catch (error) {
      console.error(error)
    }
  }

  // ------- Get a transaction with the given transaction hash ------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#gettransaction
  async GetTransaction (hash) {
    try {
      return this.client.request('theta.GetTransaction', [{ hash: hash }])
    } catch (error) {
      console.error(error)
    }
  }

  // ------- Get pending transactions ------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getpendingtransactions
  async GetPendingTransactions (hash) {
    try {
      return this.client.request('theta.GetPendingTransactions', [])
    } catch (error) {
      console.error(error)
    }
  }
}
