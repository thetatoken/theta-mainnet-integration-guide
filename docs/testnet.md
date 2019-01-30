# Connect to the Testnet

Theta Labs maintains a testnet environment which resembles the mainnet to facilitate partner testing. To connect to the testnet, open a terminal, and follow the steps below.

#### Step 1. Setup
Follow the instructions in [setup](./setup.md) to build and install the Theta ledger. Then, press `Ctrl+C` to stop the private net node, and execute the following commands.
```
mkdir ~/theta_testnet
cd $THETA_HOME
cp -r ./integration/testnet/walletnode ~/theta_testnet
```

#### Step 2. Launch and connect to the testnet
Use the following commands to launch a launch a node and connect to the Theta testnet.
```
theta start --config=~/theta_testnet/walletnode
```
Note: when the Theta Node is launched for the first time, you need to choose a password to generate an address for the node. **Please choose a secure password and keep it in a safe place**. The next time when you launch the node again, you will need the password to unlock it.
