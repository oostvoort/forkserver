<!-- ABOUT THE PROJECT -->
# About The Project
Forking and running a local simulated Ethereum environment is essential if you want to work with DeFi or do general Ethereum development.

You can use the Forkserver during the development cycle; This allows you to develop, deploy and test your dApps in a secure and deterministic environment.
Smart contracts, once implemented on the blockchain, are immutable, so it is important to test and debug smart contracts before deploying them on the blockchain.

Therefore, it is important to have a local blockchain environment that can free developers from transaction fees and delays.
The Forkserver was developed specifically for this.
It is a local in-memory blockchain for development and testing, simulating a real Ethereum network, with multiple accounts funded with test Ether.

<!-- Features -->
# Features

- Funding - Fund accounts with ETH or any ERC20 token
- Fast forwarding - Mine hundreds of blocks or change the block timestamp
- State management - Save the current state of the blockchain as a hex string which can be loaded into a fresh/restarted instance of the Forkserver to reattain the same state.

<!-- Getting Started -->
# Getting Started
It's recommended to use docker for running locally by using the provided docker-compose.yml in this repository.

## Using Docker

### Prerequisites
- [docker-engine](https://docs.docker.com/engine/install/)
- A JSON RPC Endpoint with archive capabilities like [Infura](https://www.infura.io/), [QuickNode](https://www.quicknode.com/) or [Alchemy](https://www.alchemy.com/)

### Installation
1. Copy the provided docker-compose.yml in this repository
2. Configure the environment variables as needed
3. Run `docker compose up -d`

With the default settings: the server should be running at port 3000, the forked RPC endpoint at port 8545 and the dashboard at port 8080

## Developing
If you wish to customize or extend the functionality of the Forkserver to suit your needs.

### Prerequisites
- Install [Rust](https://www.rust-lang.org/tools/install)
- Install [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Install [Protocol Buffer Compiler](https://grpc.io/docs/protoc-installation)
- Install [Protocol buffers C++ library (development files) and proto files](https://packages.debian.org/sid/libprotobuf-dev)
- A JSON RPC Endpoint with archive capabilities like [Infura](https://www.infura.io), [QuickNode](https://www.quicknode.com) or [Alchemy](https://www.alchemy.com)

To run the webapp, cd into the dashboard directory and run `yarn install` to install dependencies then run `yarn dev` to start the NextJS application in development mode.

To run the server, run `cargo run --bin server`. It should build and generate the files needed by the server and run on port 3000 (default)

## Environment Variables
`SERVER_PORT` (Default: 3000)  Determines where the GRPC Server will run.

`FORK_PORT` (Default: 8545) Determines where the JSON RPC will run.

`FORK_CHAIN_ID` (Default: 1337) Determines which chain id will be returned by the fork, important to set your metamask to this chain ID for use on the frontend  

`FORK_MNEMONIC` (Default: test ... junk) Which accounts will be funded with Ether on startup

`FORK_BLOCK_NUMBER` (Default: 0) What block number the fork server will start at, use 0 to start on latest block

`FORK_JSON_RPC_URL` URL for the JSON RPC with archive functionality

`FORK_BLOCK_TIME` (Default: 13) How many seconds before a block is mined, set to 0 to use automine mode

## Metamask
When resetting or loading state, always remember to reset your nonce by resetting your account in Metamask.

Do this by going to Settings > Advanced > Reset Account 

<!-- LICENSE -->
## License

Distributed under the MIT License.

<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

