import { useWeb3React } from '@web3-react/core'
import React, { useState } from 'react'
import { useGrpcContext } from '@/context/GrpcContext'
import Slider from '@/components/Slider'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { useMutation } from '@tanstack/react-query'


function IncreaseTimeCard() {
  const { account } = useWeb3React()
  const { forkClient } = useGrpcContext()

  const [timeToIncrease, setTimeToIncrease] = useState(1_000)

  const increaseTimeMutation = useMutation(async () => {
    try {
      await forkClient.increaseTime({ seconds: timeToIncrease })
    } catch (e: any) {
      if (e.message != 'unexpected response content type: application/grpc') throw e
    }
    alert(`Current time increased by ${timeToIncrease} seconds`)
  }, {
    onError: (e: any) => alert(e.message)
  })
  //
  // function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault()
  //
  //   if (!isAddress(accountToFund)) return alert('Invalid account')
  //
  //   fundEthMutation.mutate()
  // }

  return <Card title={"Increase Time"}>
    <div className={"flex flex-col gap-4"}>
      <Slider min={1} max={10_000} step={1} value={timeToIncrease} onChange={setTimeToIncrease} />
      <Button width={'full'} isLoading={increaseTimeMutation.isLoading}
              onClick={() => increaseTimeMutation.mutate()}>Save</Button>
    </div>
  </Card>
}


export default IncreaseTimeCard
