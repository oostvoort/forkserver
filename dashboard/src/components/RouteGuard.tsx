import React from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { useQuery } from '@tanstack/react-query'
import Spinner from '@/components/Spinner'
import { InjectedConnector } from '@web3-react/injected-connector'
import useConfigStore from '@/config/store'


function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const {
    active,
    activate,
    deactivate
  } = useWeb3React()

  const forkChainId = useConfigStore((state) => state.forkChainId)

  const checkWalletConnection = useQuery(['checkWalletConnection', active, router], async () => {
    // Disconnect wallet in index to show off that cool fox
    if (router.pathname == '/') {
      deactivate()
      return true
    }

    try {
      await activate(new InjectedConnector({ supportedChainIds: [Number(forkChainId)] }))
    } catch (e) {
      console.error('Error auto-connecting wallet')
      await router.push('/')
    }

    return true
  }, {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchInterval: false
  })

  if (checkWalletConnection.isLoading) return (
    <div className={'flex items-center justify-center h-screen w-screen mx-auto'}>
      <Spinner />
    </div>)

  return (
    <>
      {children}
    </>
  )
}

export default RouteGuard
