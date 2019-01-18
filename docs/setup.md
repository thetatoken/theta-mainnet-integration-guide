# Setup

## Preparation

Install Go and set environment variables `GOPATH` , `GOBIN`, and `PATH`. The current code base should compile with **Go 1.9.7** on a Linux-like system (i.e. Ubuntu, Mac OS X).

Clone the Theta Ledger repo https://github.com/thetatoken/theta-protocol-ledger into your `$GOPATH` with the following command. The path should look like this: `$GOPATH/src/github.com/thetatoken/ukulele`

```
git clone git@github.com:thetatoken/theta-protocol-ledger.git $GOPATH/src/github.com/thetatoken/ukulele
```

[Install glide](https://github.com/Masterminds/glide). Then execute the following commands to download all dependencies:

```
export UKULELE_HOME=$GOPATH/src/github.com/thetatoken/ukulele
cd $UKULELE_HOME
make get_vendor_deps
```
Also [install jq](https://stedolan.github.io/jq/download/) to run the unit tests. 

## Build and Install
This should build the binaries and copy them into your `$GOPATH/bin`. Two binaries `ukulele` and `banjo` are generated. `ukulele` can be regarded as the launcher of the Theta Ledger node, and `banjo` is a wallet with command line tools to interact with the ledger. 
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
cd $UKULELE_HOME
cp -r ./integration/privatenet ../privatenet
mkdir ~/.banjo
cp -r ./integration/privatenet/banjo/* ~/.banjo/
chmod 700 ~/.banjo/keys/encrypted
```
And then, use the following commands to launch a private net with a single validator node.
```
ukulele start --config=../privatenet/node
```
