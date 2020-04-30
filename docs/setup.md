# Setup

## Preparation

Install Go and set environment variables `GOPATH` , `GOBIN`, and `PATH`. The current code base should compile with **Go 1.12.1** on a Linux like system (i.e. Ubuntu, Mac OS X). Below are the steps to install Go 1.12.1 and setup the environments on Ubuntu.

```
sudo apt-get update
sudo apt-get install build-essential
sudo apt-get install gcc
sudo apt-get install make
sudo wget https://dl.google.com/go/go1.12.1.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.12.1.linux-amd64.tar.gz
echo 'export GOROOT=/usr/local/go' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH=$PATH:$GOROOT/bin:$GOPATH/bin' >> ~/.bashrc
source ~/.bashrc
```

Also [install jq](https://stedolan.github.io/jq/download/) to run the unit tests. 

```
sudo apt-get install jq
```

Clone the `release` branch of the Theta Ledger repo https://github.com/thetatoken/theta-protocol-ledger into your `$GOPATH` with the following command. The path should look like this: `$GOPATH/src/github.com/thetatoken/theta`

```
git clone --branch release https://github.com/thetatoken/theta-protocol-ledger.git $GOPATH/src/github.com/thetatoken/theta
```

Then execute the following commands to download all dependencies:

```
export THETA_HOME=$GOPATH/src/github.com/thetatoken/theta
cd $THETA_HOME
make get_vendor_deps
```

## Build and Install
This should build the binaries and copy them into your `$GOPATH/bin`. Two binaries `theta` and `thetacli` are generated. `theta` can be regarded as the launcher of the Theta Ledger node, and `thetacli` is a wallet with command line tools to interact with the ledger. 
```
make install
```

## Run Unit Tests
Run unit tests with the command below
```
make test_unit
```

## Launch a Local Private Net
Open a terminal to launch the private net. For the first time, follow the setup steps below.
```
cd $THETA_HOME
cp -r ./integration/privatenet ../privatenet
mkdir ~/.thetacli
cp -r ./integration/privatenet/thetacli/* ~/.thetacli/
chmod 700 ~/.thetacli/keys/encrypted
```
And then, use the following commands to launch a private net with a single validator node.
```
theta start --config=../privatenet/node
```
When the prompt asks for password, simply enter `qwertyuiop`

**NEXT**: The Theta [command line tools](https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/cmd.md#command-line-tool) 
