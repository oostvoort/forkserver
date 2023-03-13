import { useMutation, useQuery } from '@tanstack/react-query'
import { useGrpcContext } from '@/context/GrpcContext'
import Card from '@/components/Card'
import Form from '@/components/Form'
import MineBlock from '@/components/MineBlock'
import Slider from '@/components/Slider'
import { useState } from 'react'


function MineBlockCard() {
  const { forkClient } = useGrpcContext()

  const [blocks, setBlocks] = useState(500)

  const mineBlockMutation = useMutation(async () => {
    try {
      await forkClient.mine({ blocks: Number(blocks) })
      await blockNumber.refetch()
    } catch (e: any) {
      if (e.message != 'unexpected response content type: application/grpc') throw e
    }
  }, { onError: (e: any) => alert(e.message) })

  const blockNumber = useQuery(['blockNumber'], async () => {
    const result = await forkClient.blockNumber({})
    return result.response.blockNumber
  })


  function handleMineBlock() {
    return mineBlockMutation.mutate
  }

  return <Card title={`Mine block ${blockNumber.isSuccess ? `(${blockNumber.data})` : ''}`}>
    <Form>
      <MineBlock onMineBlock={handleMineBlock()} />
      <Slider min={1} max={10_000} step={1} value={blocks} onChange={setBlocks} />
    </Form>
  </Card>
}


export default MineBlockCard
