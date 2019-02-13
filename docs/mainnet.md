# Connect to the Mainnet

The Theta Mainnet will launch on 3/15/2019. To connect to the mainnet, open a terminal, and follow the steps below.

#### Step 1. Setup
Follow the instructions in [setup](./setup.md) to build and install the Theta ledger. Then, press `Ctrl+C` to stop the private net node, and execute the following commands.
```
cd $THETA_HOME
mkdir ../mainnet
cp -r ./integration/mainnet/walletnode ../mainnet
```

#### Step 2. Launch and connect to the mainnet
Start a screen or tmux session, and use the following commands to launch a launch a node and connect to the Theta mainnet. It may take some time to download the blockchain data to be in-sync with the network.
```
theta start --config=../mainnet/walletnode
```
**Note**: when the mainnet Theta Node is launched for the first time, you need to choose a password to generate an address for the node. *Please choose a secure password and keep it in a safe place*. The next time when you launch the node again, you will need the password to unlock it.

**NETX**: The [API reference](https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#api-reference)
