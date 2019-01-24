# API Reference

We can interact with the Theta ledger through its RPC API interface. By default the Theta node runs an RPC server at port 16888. In the examples belows, we assume the reader has followed the [setup guide](setup.md) to launch a private net on the local machine.

## Table of Contents
- [Query APIs](#query-apis)
    - [GetStatus](#getstatus)
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

### GetStatus

This API returns the current status of the blockchain.

**RPC Method**: theta.GetStatus

**Returns**

- latest_finalized_block_hash: the hash of the latest finalized block
- latest_finalized_block_height: the block height of the latest finalized block
- latest_finalized_block_time: the timestamp of the latest finalized block
- latest_finalized_block_epoch: the epoch (can be viewed as a logical clock for proposer rotation) of the latest finalized block
- current_epoch: the current epoch
- current_time: the current Unix timestamp

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetStatus","params":[],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"latest_finalized_block_hash": "0x51115199121b66ef4420a369e2b23d6b8382de9f0d4f2f8af35a7b1b1ae1b24b",
		"latest_finalized_block_height": "20554",
		"latest_finalized_block_time": "1548274304",
		"latest_finalized_block_epoch": "41106",
		"current_epoch": "41109",
		"current_time": "1548274311"
	}
}
```

### GetAccount

This API returns the details of the account being queried in json format.

**RPC Method**: theta.GetAccount

**Query Parameters**

- address: the address of the account

**Returns**

- code: the hash of the smart contract bytecode (for smart contract accounts)
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
			"tfuelwei": "4999999979999999000000000000"
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

**RPC Method**: theta.GetBlock

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
	- type: type of the transaction (see the **Transaction Types** note below)
	- hash: hash of the transaction
- status: status of the block (see the **Block Status** note below)

**Transaction Types**

```
0: coinbase transaction, for validator/guardian reward
1: slash transaction, for slashing malicious actors
2: send transaction, for sending tokens among accounts
3: reserve fund transaction, for off-chain micropayment
4: release fund transaction, for off-chain micropayment
5: service payment transaction, for off-chain micropayment
6: split rule transaction, for the "split rule" special smart contract
7: smart contract transaction, for general purpose smart contract
8: deposit stake transaction, for depositing stake to validators/guardians
9: withdraw stake transaction, for withdrawing stake from validators/guardians
```

**Block Status**

```
0: pending 
1: valid
2: invalid
3: committed
4: directly finalized
5: indirectly finalized
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

In this example, we queried the block with hash `0x9f1e77b08c9fa8984096a735d0aae6b0e43aee297e42c54ce36334103ddd67a7`. This block contains two transactions. The first one is a "coinbase" transaction (type 0), and the second is a "send" transaction (type 2). In particular, in the "send" transaction, address `0x2e833968e5bb786ae419c4d13189fb081cc43bab` sent 10 Theta and 20 TFuel tokens to address `0x9f1233798e905e173560071255140b4a8abd3ec6`, which cost 1000000000000 TFuelWei transaction fee.

```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetBlock","params":[{"hash":"0x9f1e77b08c9fa8984096a735d0aae6b0e43aee297e42c54ce36334103ddd67a7"}],"id":1}' http://localhost:16888/rpc

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
						"tfuelwei": "0"
					},
					"sequence": "0",
					"signature": "0x31af035f0dc47ded00eb5139fd5e4bb76f82e89e29adae60df1277a25b0c7b135b097502ff0aa66249a423d22f291804a9e178af59c24ccbf1af2f58b83964ef00"
				},
				"outputs": [{
					"address": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
					"coins": {
						"thetawei": "0",
						"tfuelwei": "0"
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
					"tfuelwei": "1000000000000"
				},
				"inputs": [{
					"address": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
					"coins": {
						"thetawei": "10000000000000000000",
						"tfuelwei": "20000001000000000000"
					},
					"sequence": "1",
					"signature": "0x2f8f17b13c07e57d4c5d2c89e87d9e608f0eff22ef1f96eed5647b063265450216ef4f7a8578bf702cf26db00fb2e758521873bb1b68528325c84b59a2debc7400"
				}],
				"outputs": [{
					"address": "0x9f1233798e905e173560071255140b4a8abd3ec6",
					"coins": {
						"thetawei": "10000000000000000000",
						"tfuelwei": "20000000000000000000"
					}
				}]
			},
			"type": 2,
			"hash": "0xf3cc94af7a1520b384999ad106ade9738b6cde66e2377ceab37067329d7173a0"
		}]
	}
}
```

### GetBlockByHeight

This API returns the finalized block of given the height. If none of the block at the given height is finalized (either directly or indirectly), the API simplely returns an empty result.

**RPC Method**: theta.GetBlockByHeight

**Query Parameters**

- height: the block height (need to pass in as a string instead of an integer)

**Returns**

Similar to the returns of the GetBlock API. Please [see above](#getblock).

**Example**

In this example, we query the block at height 3. The result is similar to the result of the GetBlock API.

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
		"transactions": [...]
	}
}
```

### GetTransaction

This API returns the transaction being queried in json format.

**RPC Method**: theta.GetTransaction

**Query Parameters**

- hash: the transaction hash

**Returns**

- block_hash: hash of the block that contains the transaction
- block_height: height of the block that contains the transaction
- status: status of the transaction
- hash: the hash of the transaction itself
- transaction: the details of the transaction

**Example**

In this example, the transaction being queried is a "send transaction" (i.e., type 2, see the "Transaction types" note in the [GetBlock](#getblock) section). In this transaction, address `0x2e833968e5bb786ae419c4d13189fb081cc43bab` sent 10 Theta and 20 TFuel tokens to address `0x9f1233798e905e173560071255140b4a8abd3ec6`, which cost 1000000000000 TFuelWei transaction fee.

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
				"tfuelwei": "1000000000000"
			},
			"inputs": [{
				"address": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
				"coins": {
					"thetawei": "10000000000000000000",
					"tfuelwei": "20000001000000000000"
				},
				"sequence": "1",
				"signature": "0x2f8f17b13c07e57d4c5d2c89e87d9e608f0eff22ef1f96eed5647b063265450216ef4f7a8578bf702cf26db00fb2e758521873bb1b68528325c84b59a2debc7400"
			}],
			"outputs": [{
				"address": "0x9f1233798e905e173560071255140b4a8abd3ec6",
				"coins": {
					"thetawei": "10000000000000000000",
					"tfuelwei": "20000000000000000000"
				}
			}]
		}
	}
}
```


## Tx APIs

### BroadcastRawTransaction

This API submits the given raw transaction to the blockchain, and returns only after the transaction to be included in the blockchain, or timed out (i.e. synchronous call).

**RPC Method**: theta.BroadcastRawTransaction

**Query Parameters**

- tx_bytes: the signed transaction bytes

**Returns**

- hash: the hash of the transaction
- block: the details of the block that contains the transaction

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.BroadcastRawTransaction","params":[{"tx_bytes":"02f8a4c78085e8d4a51000f86ff86d942e833968e5bb786ae419c4d13189fb081cc43babd3888ac7230489e800008901158e46f1e875100015b841c2daae6cab92e37308763664fcbe93d90219df5a3520853a9713e70e734b11f27a43db6b77da4f885213b45a294c2b4c74dc9a018d35ba93e5b9297876a293c700eae9949f1233798e905e173560071255140b4a8abd3ec6d3888ac7230489e800008901158e460913d00000"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"hash": "0x0a495698654ff5372ef8936eca727c25b975ea0f7e5ebea282e3c86017dfe521",
		"block": {
			"ChainID": "private_net",
			"Epoch": 40186,
			"Height": 20094,
			"Parent": "0x6797d42ff724a47e9dfd3aa425e2a4f06f40b64fd347ca8c9ebb43d08cb58847",
			"HCC": {
				"Votes": {},
				"BlockHash": "0x6797d42ff724a47e9dfd3aa425e2a4f06f40b64fd347ca8c9ebb43d08cb58847"
			},
			"TxHash": "0xbed5492c96d8251c2f0846a2d12d7a17eb88966a736fa0e8f96af36ed3ffaa74",
			"ReceiptHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
			"Bloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
			"StateHash": "0xd2b1fa73461fe80d266933033df073a2eb5b82d16cad46f2f74fa2b575adbc88",
			"Timestamp": 1548272003,
			"Proposer": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
			"Signature": "0x514b731086640c79122f81db1ac1a142d39a92393affb3cbaa09df395dbb441a4b735a66d0da1a52887b66a155033e51b36584dd14b68616fe30b0f2a3f434fa01"
		}
	}
}
```


### BroadcastRawTransactionAsync

This API submits the given raw transaction to the blockchain, and returns immediately (i.e. asynchronous call).

**RPC Method**: theta.BroadcastRawTransactionAsync

**Query Parameters**

- tx_bytes: the signed transaction bytes

**Returns**

- hash: the hash of the transaction

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.BroadcastRawTransactionAsync","params":[{"tx_bytes":"02f8a4c78085e8d4a51000f86ff86d942e833968e5bb786ae419c4d13189fb081cc43babd3888ac7230489e800008901158e46f1e875100016b841393e2eba6241482098cf11ef4dd869209d7ebd716397f3c862ca5b762bbf403006b1fa009786102383c408cabdf7450c1c73d4dd4a20d3b48a39a88ffe0ecb0e01eae9949f1233798e905e173560071255140b4a8abd3ec6d3888ac7230489e800008901158e460913d00000"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"hash": "0xccc7ba0360108369eaebfa0899858bf76a40c6e10d14a93c75697f42a7d33c50"
	}
}
```

## Call Smart Contract

### CallSmartContract

This API simulates the smart contract execution locally without submitting the smart contract transaction to the blockchain. It is useful to evalute the execution result, calculate the gas cost, etc.

**RPC Method**: theta.CallSmartContract

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

