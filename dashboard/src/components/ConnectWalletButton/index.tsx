import React from 'react'
import { useWeb3React } from '@web3-react/core'
import useMetamask from '@/hooks/useMetamask'
import { useMutation } from '@tanstack/react-query'
import styles from './style.module.css'
import Fox from '@/components/Fox'
import { useRouter } from 'next/router'
import { INJECTED_CONNECTOR } from '@/config/constants'
import useConfigStore from '@/config/store'

function ConnectWalletButton() {
  const {
    active,
    activate,
    deactivate
  } = useWeb3React()

  const metamask = useMetamask()
  const router = useRouter()
  const forkChainId = useConfigStore((state) => state.forkChainId)

  const connectWalletMutation = useMutation(async () => {
      if (metamask && !metamask.isMetamask && !metamask.requestChain) return
      try {
        console.log('Connecting to blockchain...')
        if (forkChainId !== (window as any).ethereum.networkVersion) {
          await metamask.requestChain(Number(forkChainId))
        }
        await activate(INJECTED_CONNECTOR)
        await router.push('/home')
      } catch (e) {
        deactivate()
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

export default ConnectWalletButton
