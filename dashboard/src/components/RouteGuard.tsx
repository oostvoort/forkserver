import React from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { useQuery } from 'react-query'
import { INJECTED_CONNECTOR } from '@/config/constants'
import Spinner from '@/components/Spinner'


function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const {
    active,
    activate,
    deactivate
  } = useWeb3React()

  const checkWalletConnection = useQuery(['checkWalletConnection', active, router], async () => {
    // Disconnect wallet in index to show off that cool fox
    if (router.pathname == '/') {
      deactivate()
      return
    }

    try {
      await activate(INJECTED_CONNECTOR)
    } catch (e) {
      console.error('Error auto-connecting wallet')
      await router.push('/')
    }
  })

  if (checkWalletConnection.isLoading) return <Spinner/>

  return (
    <>
      {children}
    </>
  )
}

export default RouteGuard
