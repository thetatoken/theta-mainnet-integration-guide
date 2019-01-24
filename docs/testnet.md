# Connect to the Testnet

Theta Labs maintains a testnet environment which resembles the mainnet to facilitate partner testing. To connect to the testnet, open a terminal, and follow the steps below.

#### Step 1. Setup
Follow the instructions in [setup](./setup.md) to build and install the Theta ledger. Then,
```
cd $THETA_HOME
cp -r ./integration/privatenet ../testnet
```

#### Step 2. Update config 
Replace the content of `../testnet/node/config.yaml` with the follow:

```
# Theta configuration
p2p:
  port: 12000
  seeds: 18.219.77.217:11000
rpc:
  enabled: true
```

#### Step 3. Update key
Also replace the content of `../testnet/node/key` with a randomly generated private key.

#### Step 4. Launch and connect to the testnet
Finally, use the following commands to launch a launch a node and connect to the Theta testnet.
```
theta start --config=../testnet/node
```

