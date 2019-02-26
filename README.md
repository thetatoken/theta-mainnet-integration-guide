# Theta Mainnet Integration Guide

This repo contains documentation and demos to facilitate Theta mainnet integration.

## Documentation

The documentation is organized under the [docs](docs/) directory. 

  - **Setup**: The [setup guide](docs/setup.md#setup) provides the instructions to build and install the Theta Ledger on a Linux machine, and lauch a local private net for testing. 

  - **CMD Tool**: The [command line tool guide](docs/cmd.md#command-line-tool) illustrates how to interact with the Theta ledger through the Theta command line interface. 

  - **Testnet/Mainnet**: The [testnet](docs/testnet.md#connect-to-the-testnet) and [mainnet](docs/mainnet.md#connect-to-the-mainnet) integration guide contain the steps for launching a Theta node and connect to the testnet and mainnet, respectively.

  - **RPC API**: The [API reference](docs/api.md#api-reference) lists the RPC APIs of the Theta ledger. 
  
  - **Configuration**: The [configuration guide](docs/config.md#configuration) provides details on the configuration of the Theta ledger.

## Demos

The [demos](demos/) directory contains the following integration examples:

  - **keypair**: The [keypair demo](demos/keypair) is a Java program which demonstrates how to quickly generate key pairs (private key and the corresponding address) in batches.

  - **tx**: We have provided the [tx demo](demos/tx) in both Java and JavaScript. It demonstrates: 1) how to construct a transaction, 2) how to sign and serialize a transaction offline, and 3) how to broadcast the signed transaction to the Theta ledger.

  - **api**: The [api demo](demos/api) is a Java program which shows how to interact with the Theta ledger through its RPC interface.
