# Configuration

## Configuration for theta

The `theta` node can be launched with parameter `--config=path/to/config/folder` as shown in the command below.

```
theta start --config=../privatenet/node
```

If the `--config` parameter is not specified, the `theta` node uses `~/.theta` as the default config folder. The `theta` node also uses the config directory to store other important data. For example, it stores its encrypted key under the `key` folder, and the blockchain data under the `db` folder.

The configuration for the `theta` node is defined by a configuration file `config.ymal` under `path/to/config/folder`. Below are the options

```
storage: # configuration of the storage module
  statePruningEnabled: true # true by default, when set to true the node will perform state pruning which can effectively reduce the disk space consumption
  statePruningInterval: 16 # the purning interval (in terms of blocks) which control the frequency the pruning procedure is activated
  statePruningRetainedBlocks: 512 # the number of blocks prior to the latest finalized block whose corresponding state tree need to be retained
p2p:
  port: 50001 # the p2p port that the Theta node listens on, 50001 by default
  seeds: 18.218.16.108:21000,18.191.88.191:21000,18.222.201.29:21000 # the IP addresses of the seed nodes
rpc:
  enabled: true # false by default, when set to true the RPC API is enabled
  port: 16888 # the PRC API port, 16888 by default
  maxConnections: # max number of simultaneous RPC connections, 200 by default
log:
  levels: "*:info" # level of logs to be printed, "*:debug" by default
```