# Command Line Tool

The Theta ledger software provides a command line wallet tool `thetacli` for users to interact with the Theta ledger. Below is an example of sending tokens between two addresses.

## Send and Receive Tokens

After building the Theta ledger, two binaries `theta` and `thetacli` are generated. `theta` can be regarded as the launcher of the Theta Ledger node, and `thetacli` is a wallet with command line tools to interact with the ledger. We can use the `thetacli` command line tool to send Theta tokens from one address to another by executing the following command. Open a terminal, and execute the following command. When the prompt asks for password, simply enter `qwertyuiop`
```
thetacli tx send --chain="private_net" --from=2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=9F1233798E905E173560071255140b4A8aBd3Ec6 --theta=10 --seq=1
```
The balance of an address can be retrieved with the following query command, after the transaction has been included in the blockchain (may take a couple seconds).
```
thetacli query account --address=9F1233798E905E173560071255140b4A8aBd3Ec6
```
Now let us send 20 more Theta tokens. Note that we need to increment the `seq` parameter to 2.
```
thetacli tx send --chain="private_net" --from=2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=9F1233798E905E173560071255140b4A8aBd3Ec6 --theta=20 --seq=2
```
We can query the receipient address again to verify the account balance changes.
```
thetacli query account --address=9F1233798E905E173560071255140b4A8aBd3Ec6
```
## CLI Command Documentation

Please refer to the following links for the detailed usage of the command line tool.

|Link|Binary|
|---|---|
|[Theta Wallet command line tools](https://github.com/thetatoken/theta-protocol-ledger/blob/master/docs/commands/wallet/thetacli.md)|thetacli|
|[Theta Ledger node](https://github.com/thetatoken/theta-protocol-ledger/blob/master/docs/commands/ledger/theta.md)|theta|

