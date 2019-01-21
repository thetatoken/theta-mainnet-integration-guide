# API Reference

We can interact with the Theta ledger through its RPC API interface. By default the Theta node runs an RPC server at port 16888. In the examples belows, we assume the reader has followed the [setup guide](setup.md) to launch a private net on the local machine.

## Table of Contents
- [Query APIs](#query-apis)
	- [GetAccount](#getaccount)
	- [GetBlock](#getblock)
	- [GetBlockByHeight](#getblockbyheight)
	- [GetTransaction](#gettransaction)
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
		"sequence": "1",
		"coins": {
			"thetawei": "994999990000000000000000000",
			"gammawei": "4999999979999999000000000000"
		},
		"reserved_funds": [],
		"last_updated_block_height": "0",
		"root": "0x0000000000000000000000000000000000000000000000000000000000000000",
		"code": "0x0000000000000000000000000000000000000000000000000000000000000000"
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
 - raw: transaction details
 - type: type of the transaction (see the "Transaction Types" note below)
 - hash: hash of the transaction
- status: status of the block (see the "Block Status" note below)

**Transaction Types**
```
{
  0: coinbase transaction, for validator/guardian reward,
  1: slash transaction, for slashing malicious actors,
  2: send transaction, for sending tokens among accounts,
  3: reserve fund transaction, for off-chain micropayment,
  4: release fund transaction, for off-chain micropayment,
  5: service payment transaction, for off-chain micropayment,
  6: split rule transaction, for the "split rule" special smart contract,
  7: smart contract transaction, for general purpose smart contract,
  8: deposit stake transaction, for depositing stake to validators/guardians,
  9: withdraw stake transaction, for withdrawing stake from validators/guardians
}
```

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
		"transactions": [
      {
        "raw" : {...},
        "type": 1,
        "hash": "0x0b715ff87534d154b90d5b9a77b65c0a03dd651b9e4d8b5560c370ba6bcf0ff4"
      }
    ]
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

In this example, we queried the block at height 3. This block contains two transactions. The first one is a "coinbase" transaction (type 0), and the second is a "send" transaction (type 2). In particular, in the "send" transaction, address `0x2e833968e5bb786ae419c4d13189fb081cc43bab` sent 10 Theta and 20 Gamma tokens to address `0x9f1233798e905e173560071255140b4a8abd3ec6`, which cost 1000000000000 GammaWei transaction fee.

```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetBlockByHeight","params":[{"height":"3"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"chain_id": "private_net",
		"epoch": "5",
		"height": "3",
		"parent": "0x724b0f68d8e45f930b95bac224fa7d67eef243307b4e84f0f666198d1d70e9d7",
		"transactions_hash": "0x2bf2c62185fceed239a55bd27ada030cf75970f09122addb2e419e70cafebdf0",
		"state_hash": "0xd41742c2b0d70e3bac1d88b2af69a2491d8c65c650af6ec4d2b8873897f8becc",
		"timestamp": "1548102762",
		"proposer": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
		"children": ["0x21d3c2bb25d0c85a1f5c3ff81bc7eeae998bf98db1dba461fb3f69a434feb90c"],
		"status": 4,
		"hash": "0x9f1e77b08c9fa8984096a735d0aae6b0e43aee297e42c54ce36334103ddd67a7",
		"transactions": [{
			"raw": {
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
				"block_height": "2"
			},
			"type": 0,
			"hash": "0x642f7d70680eefcc34f750cd6e03b57035f197baeabfa8e8420f55d994f5265f"
		}, {
			"raw": {
				"fee": {
					"thetawei": "0",
					"gammawei": "1000000000000"
				},
				"inputs": [{
					"address": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
					"coins": {
						"thetawei": "10000000000000000000",
						"gammawei": "20000001000000000000"
					},
					"sequence": "1",
					"signature": {}
				}],
				"outputs": [{
					"address": "0x9f1233798e905e173560071255140b4a8abd3ec6",
					"coins": {
						"thetawei": "10000000000000000000",
						"gammawei": "20000000000000000000"
					}
				}]
			},
			"type": 2,
			"hash": "0xf3cc94af7a1520b384999ad106ade9738b6cde66e2377ceab37067329d7173a0"
		}]
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

**Example**

In this example, the transaction being queried is a "send transaction" (i.e., type 2, see the "Transaction types" note in the [GetBlock](#getblock) section). In this transaction, address `0x2e833968e5bb786ae419c4d13189fb081cc43bab` sent 10 Theta and 20 Gamma tokens to address `0x9f1233798e905e173560071255140b4a8abd3ec6`, which cost 1000000000000 GammaWei transaction fee.

```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetTransaction","params":[{"hash":"0xf3cc94af7a1520b384999ad106ade9738b6cde66e2377ceab37067329d7173a0"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"block_hash": "0x9f1e77b08c9fa8984096a735d0aae6b0e43aee297e42c54ce36334103ddd67a7",
		"block_height": "3",
		"status": "finalized",
		"hash": "0xf3cc94af7a1520b384999ad106ade9738b6cde66e2377ceab37067329d7173a0",
		"transaction": {
			"fee": {
				"thetawei": "0",
				"gammawei": "1000000000000"
			},
			"inputs": [{
				"address": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
				"coins": {
					"thetawei": "10000000000000000000",
					"gammawei": "20000001000000000000"
				},
				"sequence": "1",
				"signature": {}
			}],
			"outputs": [{
				"address": "0x9f1233798e905e173560071255140b4a8abd3ec6",
				"coins": {
					"thetawei": "10000000000000000000",
					"gammawei": "20000000000000000000"
				}
			}]
		}
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

