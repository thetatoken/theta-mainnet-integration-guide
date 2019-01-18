# API Reference

## Table of Contents
- [GetAccount API](#getaccountapi)

## GetAccount API

This API returns the details of the account being queried in json format.

**Query Parameters**

- address: the address of the account

**Returns**

- code: hash of the smart contract bytecode (if the account is a smart contract account)
- coins: the native token balance
- reserved_funds: fund reserved for micropayment through the off-chain resource-oriented payment pool
- root: the root hash of the data trie
- sequence: the current sequence number of the account

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetAccount","params":[{"address":"0x2E833968E5bB786Ae419c4d13189fB081Cc43bab"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"sequence": "0",
		"coins": {
			"thetawei": "995000000000000000000000000",
			"gammawei": "5000000000000000000000000000"
		},
		"reserved_funds": [],
		"last_updated_block_height": "0",
		"root": "0x0000000000000000000000000000000000000000000000000000000000000000",
		"code": "0x0000000000000000000000000000000000000000000000000000000000000000"
	}
}
```
