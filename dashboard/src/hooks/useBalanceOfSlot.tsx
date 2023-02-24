import { useWeb3React } from '@web3-react/core'
import ERC20 from '../abi/erc20.json'
import { useQuery } from 'react-query'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract, ethers } from 'ethers'

export default function useBalanceOfSlot(tokenAddress: string, account?: string) {
  const {
    library
  } = useWeb3React()

  return useQuery(['balanceOfSlot', tokenAddress, account], async () => {
    const provider = library
    const maxSlot = 100
    const token = new Contract(tokenAddress, ERC20, provider)

    const accountBalance = await token.balanceOf(account)
    if (accountBalance.eq(BigNumber.from(0))) {
      throw Error('User does not have balance')
    }

    for (let i = 0; i <= maxSlot; i++) {
      const d = await provider.getStorageAt(
        tokenAddress,
        ethers.utils.solidityKeccak256(['uint256', 'uint256'], [account, i]
        ))

      let n = ethers.constants.Zero
      try {
        n = ethers.BigNumber.from(d)
      } catch (e) {
      }

      if (n.eq(accountBalance)) {
        return i
      }
    }

    throw Error('Unable to find slot')
  }, {
    enabled: Boolean(account),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity
  })
}
