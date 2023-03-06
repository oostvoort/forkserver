import type { AppProps } from 'next/app'
import { Web3Provider } from '@ethersproject/providers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Web3ReactProvider } from '@web3-react/core'
import RouteGuard from '@/components/RouteGuard'
import GrpcContextProvider from '@/context/GrpcContext'
import Head from 'next/head'
import '../styles/globals.css'

function App({
               Component,
               pageProps
             }: AppProps) {
  const library = (provider: any): Web3Provider => {
    const lib = new Web3Provider(provider)
    lib.pollingInterval = 12000
    return lib
  }

  const queryClient = new QueryClient()

  return <>
    <Head>
      <title>Forkserver Dashboard</title>
      <meta name='description' content='Made by MF' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='icon' href='/favicon.png' />
    </Head>
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider getLibrary={library}>
        <GrpcContextProvider>
          <RouteGuard>
            <Component {...pageProps} />
          </RouteGuard>
        </GrpcContextProvider>
      </Web3ReactProvider>
    </QueryClientProvider>
  </>
}

export default App
