### Key pair generation

The Theta ledger uses the same crypto libary as Ethereum for digital signatures. Hence, we can simply use the Ethereum ECC library to generate key pairs. This demo shows how to generate and validate key pairs in batch.

To run the demo, import the project under `create-key-pairs-demo` with [VS Code](https://code.visualstudio.com/), and use Maven to install the dependencies. Then, we can run the demo in the VS Code IDE, it should randomly generate and print a batch of key pairs (private key, public key, address) in the output console.

