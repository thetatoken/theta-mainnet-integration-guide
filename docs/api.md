# API Reference

Theta offers two sets of RPC APIs. The rationale of this division is to separate the public interface accessible to all users and personal interface that manages a specific user's private wallet.

The **Theta APIs** is provided by the Theta Node. It is the RPC interface via which a user can interact with the Theta Node directly. As described in the [setup guide](setup.md), the Theta Node can be launched with the following command. By default the Theta node runs its RPC server at port 16888. 

`theta start --config=<path/to/config/folder>`

The **ThetaCli APIs** is provided by the ThetaCli Daemon. It allows a user to interact with his/her personal Theta Wallet through RPC calls. The wallet can manange multiple accounts simultaneously. The encrypted private keys of the accounts are stored under ~/.thetacli/keys/encrypted/ by default. The RPC APIs supports account creation, lock/unlock, and sending Theta/TFuel. The ThetaCli Daemon can be run by the following command. If the `port` parameter is not specified, by default it runs at port 16889. Note that part of the ThetaCli Daemon's functionality depends on the Theta Node. Hence we need to have the Theta Node running when we launch the ThetaCli Daemon.

`thetacli daemon start --port=<port>`

In the examples below, we assume the reader has followed the [setup guide](setup.md) to launch **both** the Theta Node and the ThetaCli Daemon on the local machine at port 16888 and 16889 respectively.

## Table of Contents

- [Theta APIs](#theta-apis)
	- [Query APIs](#query-apis)
		- [GetVersion](#getversion)
		- [GetStatus](#getstatus)
		- [GetAccount](#getaccount)
		- [GetBlock](#getblock)
		- [GetBlockByHeight](#getblockbyheight)
		- [GetTransaction](#gettransaction)
		- [GetPendingTransactions](#getpendingtransactions)
	- [Tx APIs](#tx-apis)
		- [BroadcastRawTransaction](#broadcastrawtransaction)
		- [BroadcastRawTransactionAsync](#broadcastrawtransactionasync)
	- [Call Smart Contract](#call-smart-contract)
		- [CallSmartContract](#callsmartcontract)

- [ThetaCli APIs](#thetacli-apis)
	- [Account APIs](#account-apis)
		- [NewKey](#newkey)
		- [ListKeys](#listkeys)
		- [UnlockKey](#unlockkey)
		- [LockKey](#lockkey)
		- [IsKeyUnlocked](#iskeyunlocked)
	- [Tx APIs](#tx-apis-1)
		- [Send](#send)

## Theta APIs

## Query APIs

### GetVersion

This API returns the version of the blockchain software.

**RPC Method**: theta.GetVersion

**Returns**

- version: the version number
- git_hash: the git commit hash of the code base
- timestamp: the build timestamp

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetVersion","params":[],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"version": "1.0",
		"git_hash": "9d7669a735063a283ae8b6f0826183e3830c00a5",
		"timestamp": "Tue Feb 19 23:31:32 UTC 2019"
	}
}
```

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
- syncing: true if the node is still in the process of synchronizing with the network

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
		"current_time": "1548274311",
		"syncing":false
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
6: trusted (the first block in a verified snapshot is marked as trusted)
```
A block and all the transactions included in the block are considered Finalized by the validators if the block status is **either 4, 5, or 6**

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
		"chain_id": "privatenet",
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
		"chain_id": "privatenet",
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
### GetPendingTransactions

This API returns the pending transactions in the mempool.

**RPC Method**: theta.GetPendingTransactions

**Returns**

- tx_hashes: the hashes of the transactions pending in the mempool

**Example**

```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"theta.GetPendingTransactions","params":[],"id":1}' http://localhost:16888/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"tx_hashes": ["0x61ed06b78fededbbd262f95f321d7e48dee81e9b1e493b7f4d42c6bf7afd4b27", "0xc4162541f5e9f283bd9c3beb2798a4a2539b567dd35f52edefde7063f985ab17", "0xc63f2a5bbdc9bc34acde6b800ffd795e7794faa8c07c7c5606fa6cb16513779e", "0xce31bd8d44b1747e8c727bf54aafc7886a0c219d4c79f1245926d4d1244fed8c", "0x2fd317b7c35ea9d1775defd332edc0194c541042090884b4c1d06813b9fe601a", "0x98f3f180abdc756c6443b204b79fcb468bed8e6924da0004159ba686f47d4bd9", "0x6546f2c83405178821d88f1649d7b9f0ebbcde2d9dea59df55bfc7a5e5774267", "0x4a638c8ac1e926447258934be1766f24450856482375a8b7da2f902a4975d28a", "0x8ddc181dd80732961f2886402120ba1568deacbc55ecbfc26b1cf1bddd78c664", "0x14d430ca0c0a208e6bce3c89fcc8664fd4421ce72231ae161672b1b9d575c4e8"]
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
			"ChainID": "privatenet",
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

## ThetaCli APIs

## Account APIs

### NewKey

This API creates a new account (i.e. a private key/addres pair), and encrypts the private key under `~/.thetacli/keys/encrypted/` by default.

**RPC Method**: thetacli.NewKey

**Query Parameters**

- password: the password for the new account

**Returns**

- address: the address of the newly created account

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"thetacli.NewKey","params":[{"password":"qwertyuiop"}],"id":1}' http://localhost:16889/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"address": "0x8318dd49f83A2684E30d5fB50cD0D3D69aA82EAd"
	}
}
```

### ListKey

This API lists the addresses of all the accounts on the local machine (i.e. under `~/.thetacli/keys/encrypted/`)

**RPC Method**: thetacli.ListKey

**Query Parameters**

- None

**Returns**

- addresses: the addresses of the accounts

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"thetacli.ListKeys","params":[],"id":1}' http://localhost:16889/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"addresses": ["0x0d2fD67d573c8ecB4161510fc00754d64B401F86", "0x21cA457E6E34162654aDEe28bcf235ebE5eee5De", "0x2E833968E5bB786Ae419c4d13189fB081Cc43bab", "0x36Cb7E4dFBbE9508B3A2a331f171E4F6254E213f", "0x636524F8318bCE66C2D2d3159980ad487DF0eC2D", "0x70f587259738cB626A1720Af7038B8DcDb6a42a0", "0x8318dd49f83A2684E30d5fB50cD0D3D69aA82EAd", "0x8fc9fB79a8aa0F9D13156A3CDD74200F75895468", "0xA47B89c94a50C32CEACE9cF64340C4Dce6E5EcC6", "0xa5cdB2B0306518fb37b28bb63A1B2590FdE9b747", "0xcd56123D0c5D6C1Ba4D39367b88cba61D93F5405"]
	}
}
```

### UnlockKey

This API unlocks an account. Only unlocked accounts are allowed to send out Theta/TFuel tokens.

**RPC Method**: thetacli.UnlockKey

**Query Parameters**

- address: The address of the account to be unlocked
- password: The password for the account

**Returns**

- unlocked: A boolean indicating if the account is actually unlocked

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"thetacli.UnlockKey","params":[{"address":"0x2E833968E5bB786Ae419c4d13189fB081Cc43bab", "password":"qwertyuiop"}],"id":1}' http://localhost:16889/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"unlocked": true
	}
}
```

### LockKey

This API locks an account. A locked account cannot send out Theta/TFuel tokens.

**RPC Method**: thetacli.LockKey

**Query Parameters**

- address: The address of the account to be locked

**Returns**

- unlocked: A boolean indicating if the account is still unlocked

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"thetacli.LockKey","params":[{"address":"0x2E833968E5bB786Ae419c4d13189fB081Cc43bab"}],"id":1}' http://localhost:16889/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"unlocked": false
	}
}
```

### IsKeyUnlocked

This API returns whether an account is currently unlocked.

**RPC Method**: thetacli.IsKeyUnlocked

**Query Parameters**

- address: The address of the account to be checked

**Returns**

- unlocked: A boolean indicating if the account is still unlocked

**Example**
```
// Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"thetacli.IsKeyUnlocked","params":[{"address":"0x2E833968E5bB786Ae419c4d13189fB081Cc43bab"}],"id":1}' http://localhost:16889/rpc

// Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"unlocked": false
	}
}
```

## Tx APIs

### Send

This API sends the Theta/TFuel tokens. Note the API call can send either Theta tokens or TFuel tokens, or both in one shot.

**RPC Method**: thetacli.Send

**Query Parameters**

- chain_id: ID of the chain
- from: The address of the account to send tokens from
- to: The address of the receipient account
- thetawei: The amount of Theta tokens to be sent (in ThetaWei, 1 Theta = 10^18 ThetaWei)
- tfuelwei: The amount of TFuel tokens to be sent (in TFuelWei, 1 TFuel = 10^18 TFuelWei)
- fee: The transaction fee in TFuelWei
- sequence: The expected sequence number of the from account
- async: A boolean flag. If `async` is set to `false`, the RPC call will wait until the transaction has been included in a block, or a timeout reached. Otherwise, the RPC call will return immediately with the transaction hash. 

**Returns**

- hash: the hash of the transaction
- block: the details of the block that has included the transaction

**Example**

```
// Async Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"thetacli.Send","params":[{"chain_id":"privatenet", "from":"0x2E833968E5bB786Ae419c4d13189fB081Cc43bab", "to":"0xA47B89c94a50C32CEACE9cF64340C4Dce6E5EcC6", "thetawei":"99000000000000000000", "tfuelwei":"88000000000000000000", "fee":"1000000000000", "sequence":"6", "async":true}],"id":1}' http://localhost:16889/rpc

// Async Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"hash": "0xe3e82ae1e08ca49f85842729bd3c70ba0874d59cca3812fe0807506463851d22",
		"block": null
	}
}

// Sync Request
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"thetacli.Send","params":[{"chain_id":"privatenet", "from":"0x2E833968E5bB786Ae419c4d13189fB081Cc43bab", "to":"0xA47B89c94a50C32CEACE9cF64340C4Dce6E5EcC6", "thetawei":"99000000000000000000", "tfuelwei":"88000000000000000000", "fee":"1000000000000", "sequence":"7", "async":false}],"id":1}' http://localhost:16889/rpc

// Sync Result
{
	"jsonrpc": "2.0",
	"id": 1,
	"result": {
		"hash": "0xd4dfa1b763cac0c18c816e31ff585c01f2c4f2604dfff01cb6638d6d19e1bd1e",
		"block": {
			"ChainID": "privatenet",
			"Epoch": 170511,
			"Height": 170472,
			"Parent": "0xe36483c52eeee44634038252bb33dfe6b70c439c94c89236c6f18c1a4a676e01",
			"HCC": {
				"Votes": {},
				"BlockHash": "0xe36483c52eeee44634038252bb33dfe6b70c439c94c89236c6f18c1a4a676e01"
			},
			"TxHash": "0xff0d7f1bd6aa699369a935de46c287b30917958c6dbd2d542d31548eaf279525",
			"ReceiptHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
			"Bloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
			"StateHash": "0x49374ccea64633a51358816d29a55f372d0fbe7e2f9cb1447ddd2c7519fc17e5",
			"Timestamp": 1550129583,
			"Proposer": "0x2e833968e5bb786ae419c4d13189fb081cc43bab",
			"Signature": "0x96dad1ff2ccc4eb2e18ca99f488cb9d6e6f3333c53a3347d7f8ded5f7301b613763bf0301a85b8f8e7342858c29dd1b262b1b6bdb9552fa5c9b6b61a9b4f6d5c01"
		}
	}
}
```