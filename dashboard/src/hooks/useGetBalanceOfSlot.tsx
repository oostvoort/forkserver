import { useWeb3React } from '@web3-react/core'
import ERC20 from '../config/abi/erc20.json'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract, ethers } from 'ethers'

function useGetBalanceOfSlot() {
  const {
    library
  } = useWeb3React()

  return async (tokenAddress: string, tokenHolder?: string) => {
    const provider = library
    const maxSlot = 100
    const token = new Contract(tokenAddress, ERC20, provider)

    const accountBalance = await token.balanceOf(tokenHolder)
    if (accountBalance.eq(BigNumber.from(0))) {
      throw Error(
        `${tokenHolder} does not have balance, check here https://etherscan.io/token/${tokenAddress}#balances`)
    }

    for (let i = 0; i <= maxSlot; i++) {
      const d = await provider.getStorageAt(
        tokenAddress,
        ethers.utils.solidityKeccak256(['uint256', 'uint256'], [tokenHolder, i]
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

    throw Error(`Unable to find slot for ${tokenAddress}`)
  }
}

export default useGetBalanceOfSlot
