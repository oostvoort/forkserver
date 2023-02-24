import { useMutation, useQuery } from 'react-query'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import { formatEther, isAddress } from 'ethers/lib/utils'
import { useState } from 'react'
import ERC20 from '../abi/erc20.json'
import useBalanceOfSlot from '@/hooks/useBalanceOfSlot'
import { useGrpcContext } from '@/context/GrpcContext'

export function TokenBalance() {
  const {
    library,
    account
  } = useWeb3React()

  const {forkClient} = useGrpcContext()

  const [tokenAddress, setTokenAddress] = useState('0xdac17f958d2ee523a2206206994597c13d831ec7')
  const [tokenContract, setTokenContract] = useState<Contract>()
  const [tokenHolder, setTokenHolder] = useState('0x0000000000000000000000000000000000000000')

  const balanceOfSlot = useBalanceOfSlot(tokenAddress, tokenHolder)


  const balance = useQuery(['balance', tokenAddress], async () => {
    if (!tokenContract) return
    return await tokenContract.balanceOf(account)
  }, { enabled: Boolean(tokenContract) })

  const symbol = useQuery(['symbol', tokenAddress], async () => {
    if (!tokenContract) return
    return await tokenContract.symbol()
  }, { enabled: Boolean(tokenContract) })

  const handleSubmit = (event: any) => {
    event.preventDefault()
    setTokenContract(new Contract(tokenAddress, ERC20, library))
    symbol.refetch()
    balance.refetch()
    balanceOfSlot.refetch()
  }

  const fundMeMutation = useMutation(async () => {
    if (!account || !balanceOfSlot.isSuccess) return
    await forkClient.fundToken({
      tokenAddress,
      accountAddress: account,
      amount: "9999999999999999999999999",
      slot: Number(balanceOfSlot.data)
    })
  })

  function handleFundMe() {
    fundMeMutation.mutate()
  }

  return <div>
    <form onSubmit={handleSubmit}>
      <label>
        token address &nbsp;
        <input
          type='text'
          value={tokenAddress}
          onChange={(event) => setTokenAddress(event.target.value)}
        />
      </label>
      <br />
      {isAddress(tokenAddress) &&
        <>
          <label>
            token holder &nbsp;
            <input
              type='text'
              value={tokenHolder}
              onChange={(event) => setTokenHolder(event.target.value)}
            />
          </label>
          <br />
          token holder must have balance,&nbsp;
          <a target={'_blank'}
             style={{color: "pink"}}
             href={`https://etherscan.io/token/${tokenAddress}#balances`}>click here to
            get one</a>
        </>
      }
      <br />
      <br />
      {isAddress(tokenAddress) && isAddress(tokenHolder) && <button type='submit'>submit</button>}
    </form>
    <br />
    token: {symbol.isSuccess && symbol.data}
    <br />
    balance: {balance.isSuccess && balance.data && formatEther(balance.data.toString())}
    <br />
    balanceOf slot: {balanceOfSlot.isSuccess && balanceOfSlot.data.toString()}
    <br />
    <br />
    <button onClick={handleFundMe}>fund me</button>
  </div>
}


