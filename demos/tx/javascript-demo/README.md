### Transaction Demos

This JavaScript program contains three demos: 1) Construct a transaction, 2) sign and serialize the transaction, and 3) broadcast the signed transaction to the blockchain. For convenience, we have combined these three demos into one program. However, we note that each demo can be easily modified to be a standalone program. In particular, the second demo (transaction signing) can be run on an OFFLINE computer to sign the transaction in a more secure evironment.

To run the demo, first follow the steps in the setup guide to [launch a local private net](https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/setup.md#setup). Then, run the following command under `theta-tx-demo` to install the dependencies.

```npm install```

Next, execute the following command to print out the signed raw bytes of the example transaction.

```npm run test```
