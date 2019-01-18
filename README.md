# Theta Mainnet Integration Guide

This repo contains documentation and demos to guide the Theta mainnet integration.

### Documentation

The documentation is organized under the [docs](docs/) directory. The [setup guide](docs/setup.md) provides the instructions to build and install the Theta Ledger on a Linux machine, and lauch a local private net for testing. The [command line tool guide](docs/cmd.md) illustrates how to interact with the Theta ledger through the Theta command line interface. The [API document](docs/api.md) lists the RPC APIs of the Theta ledger. The [testnet](docs/testnet.md) and [mainnet](docs/mainnet.md) integration guide contain the steps for launching a Theta node and connect to the testnet and mainnet, respectively.

### Demos

The [demos](demos/) directory contains a couple integration examples:

**keypair**: A Java program which demonstrates how to quickly generate key pairs (private key and the corresponding address) in batches.

**tx**: Three Java programs that demonstrate: 1) how to construct and serialize a transaction, 2) how to sign a transaction offline, and 3) how to broadcast the signed transaction to the Theta ledger.

**api**: A Java programs that shows how to interact with the Theta ledger through its RPC interface.
