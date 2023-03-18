import { useMutation, useQuery } from '@tanstack/react-query'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import useGetBalanceOfSlot from '@/hooks/useGetBalanceOfSlot'
import { useGrpcContext } from '@/context/GrpcContext'
import Card from '@/components/Card'
import Form, { FormSubmitButton, FormTextField } from '@/components/Form'
import Spinner from '@/components/Spinner'
import { formatUnits, isAddress } from 'ethers/lib/utils'
import { Contract } from 'ethers'
import ERC20 from '@/config/abi/erc20.json'
import { denominateNumber } from '@/utils/text'


function FundTokenCard() {
  const {
    account,
    library,
    active
  } = useWeb3React()
  const { forkClient } = useGrpcContext()

  const [tokenAddress, setTokenAddress] = useState('0xdac17f958d2ee523a2206206994597c13d831ec7')
  const [tokenHolder, setTokenHolder] = useState('0x0000000000000000000000000000000000000000')
  const [accountToFund, setAccountToFund] = useState(account ?? '0x0000000000000000000000000000000000000000')

  const getBalanceOfSlot = useGetBalanceOfSlot()

  const fundTokenMutation = useMutation(async () => {
    const balanceOfSlot = await getBalanceOfSlot(tokenAddress, tokenHolder)
    try {
      await forkClient.fundToken({
        tokenAddress,
        accountAddress: accountToFund,
        amount: '999999999999999999',
        slot: balanceOfSlot
      })
    } catch (e: any) {
      if (e.message != 'unexpected response content type: application/grpc') throw e
    }
    alert(`Funded, reset your metamask wallet!`)
  }, {
    onError: (e: any) => alert(e.message)
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isAddress(accountToFund)) return alert('Invalid account')
    if (!isAddress(tokenAddress)) return alert('Invalid token address')
    if (!isAddress(tokenHolder)) return alert('Invalid token holder')

    fundTokenMutation.mutate()
  }

  const tokenInfoQuery = useQuery(['balance', tokenAddress, accountToFund], async () => {
    if (!library) throw Error('Undefined provider')
    const token = new Contract(tokenAddress, ERC20, library)
    const tokenDecimals = await token.decimals()
    const tokenSymbol = await token.symbol()
    return {
      balance: formatUnits(await token.balanceOf(accountToFund), tokenDecimals),
      symbol: tokenSymbol
    }
  }, { enabled: Boolean(library) })

  const balance = tokenInfoQuery.isSuccess ? `${denominateNumber(
    Number(tokenInfoQuery.data.balance))} ${tokenInfoQuery.data.symbol}` : ''
  const accountLabel = `Account (${balance})`

  return <Card title={'Fund Token'}>
    <Form onSubmit={handleSubmit}>
      <FormTextField label={accountLabel} value={accountToFund}
                     onChange={(event) => setAccountToFund(event.target.value)} />
      <FormTextField label={'Token'} value={tokenAddress} onChange={(event) => setTokenAddress(event.target.value)} />
      <FormTextField label={'Token Holder'} value={tokenHolder}
                     onChange={(event) => setTokenHolder(event.target.value)} />
      <FormSubmitButton>{fundTokenMutation.isLoading ? <Spinner /> : 'Fund'}</FormSubmitButton>
    </Form>
  </Card>
}


export default FundTokenCard
