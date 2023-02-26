import { useMutation, useQuery } from 'react-query'
import { useGrpcContext } from '@/context/GrpcContext'
import Card from '@/components/Card'
import Form from '@/components/Form'
import MineBlock from '@/components/MineBlock'
import Slider from '@/components/Slider'
import { useState } from 'react'


export function MineBlockForm() {
  const { forkClient } = useGrpcContext()

  const [blocks, setBlocks] = useState(50)

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
    console.warn({ result })
    return result.response.blockNumber
  }, { refetchInterval: 5000 })


  function handleMineBlock() {
    return mineBlockMutation.mutate
  }

  return <Card title={`Mine block ${blockNumber.isSuccess ? `(${blockNumber.data})` : ''}`}>
    <Form>
      <MineBlock onMineBlock={handleMineBlock()} />
      <Slider value={blocks} onChange={setBlocks} />
    </Form>
  </Card>
}


