import { useMutation } from '@tanstack/react-query'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import { useGrpcContext } from '@/context/GrpcContext'
import Card from '@/components/Card'
import Form, { FormSubmitButton, FormTextField } from '@/components/Form'
import Spinner from '@/components/Spinner'
import { isAddress } from 'ethers/lib/utils'


function FundEthCard() {
  const { account } = useWeb3React()
  const { forkClient } = useGrpcContext()

  const [accountToFund, setAccountToFund] = useState(account ?? '0x0000000000000000000000000000000000000000')

  const fundEthMutation = useMutation(async () => {
    try {
      await forkClient.setBalance({ address: accountToFund })
    } catch (e: any) {
      if (e.message != 'unexpected response content type: application/grpc') throw e
    }
    alert(`Funded with ETH, reset your metamask wallet!`)
  }, {
    onError: (e: any) => alert(e.message)
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isAddress(accountToFund)) return alert('Invalid account')

    fundEthMutation.mutate()
  }

  return <Card title={'Fund Eth'}>
    <Form onSubmit={handleSubmit}>
      <FormTextField label={'Account'} value={accountToFund}
                     onChange={(event) => setAccountToFund(event.target.value)} />
      <FormSubmitButton>{fundEthMutation.isLoading ? <Spinner /> : 'Fund'}</FormSubmitButton>
    </Form>
  </Card>
}


export default FundEthCard
