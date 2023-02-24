import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import { HardhatUserConfig } from 'hardhat/config'
import 'hardhat-change-network'
import 'hardhat-forktools'
import '@nomiclabs/hardhat-ethers'
import '@oostvoort/glue'
import '@openzeppelin/hardhat-upgrades'

import './contracts/forkserver/tasks'
import { rpcConfig } from './contracts/forkserver/hardhat.config.include'

// Let dotenv load the .env in the root of the project
dotenvConfig({ path: resolve(__dirname, '../../.env') })

// const network = 'hardhat'
const network = process.env.NETWORK ?? 'hardhat'

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    // @ts-ignore
    ...rpcConfig[network],
    localhost_fork_mainnet: {
      url: 'http://0.0.0.0:8545/',
      chainId: process.env.ENVIRONMENT != 'local' ? 1337 : 31337
    },
    localhost_fork_bsc: {
      url: `http://localhost:10056/`,
      chainId: 10056
    },
    localhost_fork_polygon: {
      url: `http://localhost:10137/`,
      chainId: 10137
    }
  },
  paths: {
    artifacts: './contracts/artifacts',
    sources: './contracts/contracts',
    cache: './contracts/cache'
  }
}

export default config
