### Private net Api Demos

To run the demo, first follow the steps in the setup guide to [launch a local private net](https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/setup.md#setup). Then, run the following command under `javascript-nodejs-demo` folder to install the dependencies.

```
npm install
```

And then, use the following commands to launch a private net with a single validator node.
When the prompt asks for password, simply enter `qwertyuiop`.

```
theta start --config=../privatenet/node
```

Next, execute the following command to print out the response of the local private net tests.

```
npm run test
```
