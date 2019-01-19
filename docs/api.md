# API Reference

We can interact with the Theta ledger through its RPC API interface. By default the Theta node runs an RPC server at port 16888. In the examples belows, we assume the reader has followed the [setup guide](setup.md) to launch a private net on the local machine.

## Table of Contents
- [Query APIs](#query-apis)
	- [GetAccount](#getaccount)
	- [GetTransaction](#gettransaction)
	- [GetBlock](#getblock)
	- [GetBlockByHeight](#getblockbyheight)
- [Tx APIs](#tx-apis)
	- [BroadcastRawTransaction](#broadcastrawtransaction)
	- [BroadcastRawTransactionAsync](#broadcastrawtransactionasync)
- [Call Smart Contract](#call-smart-contract)
	- [CallSmartContract](#callsmartcontract)
	
## Query APIs

### GetAccount

This API returns the details of the account being queried in json format.

**Query Parameters**

- address: the address of the account

**Returns**

- code: hash of the smart contract bytecode (for smart contract accounts)
- coins: the native token balance
- reserved_funds: fund reserved for micropayment through the off-chain resource-oriented payment pool
- root: the root hash of the data Merkle-Patricia trie (for smart contract accounts)
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
### GetTransaction

This API returns the transaction being queried in json format.

**Query Parameters**

- hash: the transaction hash

**Returns**

- block_hash: hash of the block that contains the transaction
- block_height: height of the block that contains the transaction
- status: status of the transaction
- hash: the hash of the transaction itself
- transaction: the details of the transaction

```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetTransaction","params":[{"hash":"0x0b715ff87534d154b90d5b9a77b65c0a03dd651b9e4d8b5560c370ba6bcf0ff4"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"block_hash": "0xc1c2a245fb1cbde39bfabd23cce12d42dc90acbebd99e6e416dec4d18130f2ef",
		"block_height": "1",
		"status": "finalized",
		"hash": "0x0b715ff87534d154b90d5b9a77b65c0a03dd651b9e4d8b5560c370ba6bcf0ff4",
		"transaction": {
			"proposer": {
				"address": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
				"coins": {
					"thetawei": "0",
					"gammawei": "0"
				},
				"sequence": "0",
				"signature": {}
			},
			"outputs": [{
				"address": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
				"coins": {
					"thetawei": "0",
					"gammawei": "0"
				}
			}],
			"block_height": "0"
		}
	}
}
```

### GetBlock

This API returns the block being queried in json format.

**Query Parameters**

- hash: the block hash

**Returns**

- chain_id: ID of the chain
- epoch: epoch of the block
- height: height of the block
- parent: hash of the parent block
- transactions_hash: root hash of the transaction Merkle-Patricia trie
- state_hash: root hash of the state Merkle-Patricia trie
- timestamp: timestamp when the block was proposed
- proposer: address of the proposer validator
- children: children blocks
- hash: the block hash
- transactions: json representation of the transactions contained in the block
- status: status of the block (see the "Block Status" note below).

**Block Status**

```
{
	0: pending, 
	1: invalid,
	2: valid,
	3: committed,
	4: directly finalized, 
	5: indirectly finalized,
	
}
```
A block is considered Finalized by the validators if the status is **either 4 or 5**

```
Block status transitions:

+-------+          +-------+                          +-------------------+
|Pending+---+------>Invalid|                    +----->IndirectlyFinalized|
+-------+   |      +-------+                    |     +-------------------+
            |                                   |
            |      +-----+        +---------+   |     +-----------------+
            +------>Valid+-------->Committed+---+----->DirectlyFinalized|
                   +-----+        +---------+         +-----------------+

```
**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetBlock","params":[{"hash":"0xc1c2a245fb1cbde39bfabd23cce12d42dc90acbebd99e6e416dec4d18130f2ef"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"chain_id": "",
		"epoch": "1",
		"height": "1",
		"parent": "0x2264d9e9f8e929ac9a39947029adc33d8a33d226a26960b20ebc08a59c208d23",
		"transactions_hash": "0x9e35782ddf9110118434ca5c4db7ff9ec7f0186e215f6efaea76ff34815fb46c",
		"state_hash": "0x6bab2eae0448b40183c3b0140f2c9a05405a6d27ecc45cbbd90a839c7d1c3191",
		"timestamp": "1547580477",
		"proposer": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
		"children": ["0xf6cd62e2314a6c98d98a76c744c3f80cae6f012e7ed5750b28dae144b828f6fa"],
		"status": 4,
		"hash": "0xc1c2a245fb1cbde39bfabd23cce12d42dc90acbebd99e6e416dec4d18130f2ef",
		"transactions": [...]
	}
}
```

### GetBlockByHeight

This API returns the finalized block of given the height. If none of the block at the given height is finalized (either directly or indirectly), the API simplely returns an empty result.

**Query Parameters**

- height: the block height (need to pass in as a string instead of an integer)

**Returns**

Similar to the returns of the GetBlock API. Please [see above](#getblock).

**Example**

```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetBlockByHeight","params":[{"height":"1"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"chain_id": "",
		"epoch": "1",
		"height": "1",
		"parent": "0x2264d9e9f8e929ac9a39947029adc33d8a33d226a26960b20ebc08a59c208d23",
		"transactions_hash": "0x9e35782ddf9110118434ca5c4db7ff9ec7f0186e215f6efaea76ff34815fb46c",
		"state_hash": "0x6bab2eae0448b40183c3b0140f2c9a05405a6d27ecc45cbbd90a839c7d1c3191",
		"timestamp": "1547580477",
		"proposer": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
		"children": ["0xf6cd62e2314a6c98d98a76c744c3f80cae6f012e7ed5750b28dae144b828f6fa"],
		"status": 4,
		"hash": "0xc1c2a245fb1cbde39bfabd23cce12d42dc90acbebd99e6e416dec4d18130f2ef",
		"transactions": [...]
	}
}
```

## Tx APIs

### BroadcastRawTransaction

This API submits the given raw transaction to the blockchain, and returns only after the transaction to be included in the blockchain, or timed out (i.e. synchronous call).

**Query Parameters**

- tx_bytes: the signed transaction bytes

**Returns**

**Example**
```
```


### BroadcastRawTransactionAsync

This API submits the given raw transaction to the blockchain, and returns immediately (i.e. asynchronous call).

**Query Parameters**

- tx_bytes: the signed transaction bytes

**Returns**

**Example**
```
```

## Call Smart Contract

### CallSmartContract

This API simulates the smart contract execution locally without submitting the smart contract transaction to the blockchain. It is useful to evalute the execution result, calculate the gas cost, etc.

**Query Parameters**

- sctx_bytes: the signed transaction bytes

**Returns**

- vm_return: the return of the virtual machine
- contract_address: the address of the corresponding smart contract
- gas_used: amount of gas used for the smart contract execution
- vm_error: error returned by the virtual machine if any

**Example**
```
```

