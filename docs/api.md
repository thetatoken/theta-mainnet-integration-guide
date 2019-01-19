# API Reference

## Table of Contents
- [GetAccount](#getaccount)
- [GetTransaction](#gettransaction)
- [GetBlock](#getblock)
- [GetBlockByHeight](#getblockbyheight)

## GetAccount

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
## GetTransaction

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
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetTransaction","params":[{"hash":"0xf02066216334a7bde4d4f670817d06165a69d8e44b4aedad1b26f2be217e68c7"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"block_hash": "0xb372c01b546d7e94e906bee92a6f2c4d30b9c90827113978ef604301282eff36",
		"block_height": "5854",
		"status": "finalized",
		"hash": "0xf02066216334a7bde4d4f670817d06165a69d8e44b4aedad1b26f2be217e68c7",
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
			"block_height": "5853"
		}
	}
}
```

## GetBlock

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
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetBlock","params":[{"hash":"0xb372c01b546d7e94e906bee92a6f2c4d30b9c90827113978ef604301282eff36"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"chain_id": "",
		"epoch": "11706",
		"height": "5854",
		"parent": "0x03178520f9a92bb1f291ebe42a5feff9f35c9f4edb297476bae2c94fb300756c",
		"transactions_hash": "0xe3a2e64dc731c493cf6558f3a11a2d9fe6011d43cbbf2ee802a965c65d5a1f02",
		"state_hash": "0x6bab2eae0448b40183c3b0140f2c9a05405a6d27ecc45cbbd90a839c7d1c3191",
		"timestamp": "1547854431",
		"proposer": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
		"children": ["0x456a39f9f816376fb40170c2a21a2b2b3e69a25b0a2f18fdcffd3256ed6b8461"],
		"status": 2,
		"hash": "0xb372c01b546d7e94e906bee92a6f2c4d30b9c90827113978ef604301282eff36",
		"transactions": [...]
	}
}
```

## GetBlockByHeight

This API returns the finalized block of given the height. If none of the block at the given height is finalized (either directly or indirectly), the API simplely returns an empty result.

**Query Parameters**

- height: the block height (need to pass in as a string instead of an integer)

**Returns**

Similar to the returns of the GetBlock API. Please [see above](#getblock).

**Example**

```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetBlockByHeight","params":[{"height":"6092"}],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"chain_id": "",
		"epoch": "12182",
		"height": "6092",
		"parent": "0x8b2e6ef21053ffa84a4d70db7d65659fec09449c208668a4fcbda601dcd86c6c",
		"transactions_hash": "0x37795472f1a78ce2951b9d76b35d2f6428ed5ecb13b7e993f1296be9dc16945b",
		"state_hash": "0x6bab2eae0448b40183c3b0140f2c9a05405a6d27ecc45cbbd90a839c7d1c3191",
		"timestamp": "1547855622",
		"proposer": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
		"children": ["0xf507fe7c8f6ebb95eccaaca347d48e23804a0c6b0ac0a157f30fa6ad83387f26"],
		"status": 2,
		"hash": "0xc6e5ad5e3d38e4391b06a5023d5687dbbd039d2772ac655799b61e3e6cd3d810",
		"transactions": [...]
	}
}
```
