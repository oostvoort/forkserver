<!-- ABOUT THE PROJECT -->
# About The Project
Forking and running a local simulated Ethereum environment is essential if you want to work with DeFi or do general Ethereum development.

You can use APPLICATION_NAME to simulate a local blockchain environment and test implemented smart contracts.
You can use APPLICATION_NAME during the development cycle; This allows you to develop, deploy and test your dApps in a secure and deterministic environment.
Smart contracts, once implemented on the blockchain, are immutable, so it is important to test and debug smart contracts before deploying them on the blockchain.

Therefore, it is important to have a local blockchain environment that can free developers from transaction fees and delays.
APPLICATION_NAME was developed specifically for this.
It is a local in-memory blockchain for development and testing, simulating a real Ethereum network, with multiple accounts funded with test Ether.

<!-- Features -->
# Features

- Funding - Fund accounts with ETH or any ERC20 token
- Fast forwarding - Mine hundreds of blocks or change the block timestamp
- State management - Save the current state of the blockchain as a hex string which can be loaded into a fresh/restarted instance of APPLICATION_NAME to reattain the same state.

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
If you wish to customize or extend the functionality of the APPLICATION_NAME to suit your needs.

### Prerequisites
- Install [Rust](https://www.rust-lang.org/tools/install)
- Install [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Install [Protocol Buffer Compiler](https://grpc.io/docs/protoc-installation)
- Install [Protocol buffers C++ library (development files) and proto files](https://packages.debian.org/sid/libprotobuf-dev)
- A JSON RPC Endpoint with archive capabilities like [Infura](https://www.infura.io), [QuickNode](https://www.quicknode.com) or [Alchemy](https://www.alchemy.com)

To run the webapp, cd into the dashboard directory and run `yarn install` to install dependencies then run `yarn dev` to start the NextJS application in development mode.

To run the server, run `cargo run --bin server`. It should build and generate the files needed by the server and run on port 3000 (default)

<!-- LICENSE -->
## License

Distributed under the MIT License.

<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

