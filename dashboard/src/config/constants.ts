import { InjectedConnector } from '@web3-react/injected-connector'
import * as process from 'process'


function loadEnv(env: string | undefined): string {
  if (!env) throw Error(`Missing ENV ${env}`)
  return env as string
}

export const ENV = {
  FORK_SERVER_ENDPOINT: loadEnv(process.env.NEXT_PUBLIC_FORK_SERVER_ENDPOINT),
  FORK_CHAIN_ID: loadEnv(process.env.NEXT_PUBLIC_FORK_CHAIN_ID)
}

