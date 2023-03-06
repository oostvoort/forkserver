import React from 'react'

function useMetamask() {

  function isMetamask() {
    return (window as any).ethereum && (window as any).ethereum.isMetaMask
  }

  async function requestChain(id: number) {
    const provider = (window as any).ethereum
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${id.toString(16)}` }]
    })
  }

  // TODO: uhhh
  async function addChainLocal() {
    const provider = (window as any).ethereum
    const chainId = 137
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName: 'Polygon POS',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
          blockExplorerUrls: ['https://polygonscan.com']
        }
      ]
    })
  }

  return {
    isMetamask,
    requestChain
  }
}

export default useMetamask
