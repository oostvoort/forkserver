import { useGrpcContext } from '@/context/GrpcContext'
import Card from '@/components/Card'
import Button from '@/components/Button'
import useLocalStorage from '@/components/useLocalStorage'
import { useMutation } from '@tanstack/react-query'

function StateManagementCard() {
  const { forkClient } = useGrpcContext()


  const [saveStates, setSaveStates] = useLocalStorage('SAVE_STATES', [])

  const saveStateMutation = useMutation(async () => {
    try {
      const newSaveState = await forkClient.saveState({}).response
      setSaveStates([...saveStates, {
        timestamp: Date.now(),
        state: newSaveState.state
      }])
    } catch (e: any) {
      if (e.message != 'unexpected response content type: application/grpc') throw e
    }
  }, {
    onError: (e: any) => alert(e.message)
  })

  const loadStateMutation = useMutation(async (state: string) => {
    try {
      await forkClient.reset({}).response
      await forkClient.loadState({ state }).response
      await forkClient.mine({ blocks: 500 }).response
      alert('Loaded state')
    } catch (e: any) {
      if (e.message != 'unexpected response content type: application/grpc') throw e
    }
  }, {
    onError: (e: any) => alert(e.message)
  })

  const resetStateMutation = useMutation(async () => {
    try {
      await forkClient.reset({}).response
      alert('Reset state')
    } catch (e: any) {
      if (e.message != 'unexpected response content type: application/grpc') throw e
    }
  }, {
    onError: (e: any) => alert(e.message)
  })

  const handleCopy = (state: string) => {
    navigator.clipboard.writeText(state).then(() => alert('State as hex string copied to clipboard'))
  }

  return <Card title={'Manage State'}>
    <div className='flex h-80 flex-col place-content-between'>
      <div className={'max-h-48 overflow-y-auto px-2'}>
        {saveStates.map((saveState: { timestamp: number, state: string }, index: any) => {
          return (
            <div className={'flex flex-row items-center place-content-between space-x-4 mb-2'} key={index}>
              <div>{new Date(saveState.timestamp).toLocaleString()}</div>
              <div>
                <Button color={'transparent'} onClick={() => handleCopy(saveState.state)}>📋</Button>
                <Button isLoading={loadStateMutation.isLoading} onClick={() => loadStateMutation.mutate(saveState.state)}>Load</Button>
              </div>
            </div>
          )
        })}
      </div>
      <div className={'flex flex-col place-content-between space-y-4'}>
        <Button width={'full'} isLoading={saveStateMutation.isLoading}
                onClick={() => saveStateMutation.mutate()}>Save</Button>
        <Button width={'full'} color='red' onClick={() => resetStateMutation.mutate()}
                isLoading={resetStateMutation.isLoading}>Reset</Button>
      </div>
    </div>
  </Card>
}

export default StateManagementCard
