import React from 'react'
import { useWeb3React } from '@web3-react/core'
import useMetamask from '@/hooks/useMetamask'
import { useMutation } from 'react-query'
import { InjectedConnector } from '@web3-react/injected-connector'
import styles from './style.module.css'
import Fox from '@/components/Fox'
import { useRouter } from 'next/router'

export default function ConnectWalletButton() {
  const {
    active,
    activate
  } = useWeb3React()

  const metamask = useMetamask()
  const router = useRouter()

  const connectWalletMutation = useMutation(async () => {
      if (metamask && !metamask.isMetamask && !metamask.requestChain) return
      const injectedConnector = new InjectedConnector({ supportedChainIds: [1337] })

      try {
        console.log('Connecting to blockchain...')
        if (1337 !== (window as any).ethereum.networkVersion) {
          await metamask.requestChain(1337)
        }
        await activate(injectedConnector)
        await router.push('/console')
      } catch (e) {
        console.error(e)
      }
    }
  )

  const handleClick = () => {
    connectWalletMutation.mutate()
  }

  if (active) return null

  return (
    <>
      <button className={styles.button} onClick={handleClick}>
        <Fox followMouse />
      </button>
    </>
  )
}

