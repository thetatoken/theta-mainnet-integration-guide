import jayson from 'jayson/promise'

// API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#api-reference

// Before running this demo, please follow the steps in the setup guide to launch a local private net
// Setup guide: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/setup.md#setup
export default class AccountApi {
  constructor (rpcURL) {
    this.rpc_url = rpcURL
    this.client = jayson.client.http(this.rpc_url)
  }

  // --------------- Creates a new account ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#newkey
  async NewKey (password) {
    try {
      let response = await this.client.request('thetacli.NewKey', [{ password }])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Lists the addresses of all the accounts on the local machine ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#listkeys
  async ListKeys () {
    try {
      let response = await this.client.request('thetacli.ListKeys', [])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Unlocks an account ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#unlockkey
  async UnlockKey (address, password) {
    try {
      let response = await this.client.request('thetacli.UnlockKey', [{ address, password }])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Locks an account ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#lockkey
  async LockKey (address) {
    try {
      let response = await this.client.request('thetacli.LockKey', [{ address }])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Returns whether an account is currently unlocked ---------------- //
  // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#iskeyunlocked
  async IsKeyUnlocked (address) {
    try {
      let response = await this.client.request('thetacli.IsKeyUnlocked', [{ address }])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
