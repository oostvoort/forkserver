import { useGrpcContext } from '@/context/GrpcContext'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { useMutation } from '@tanstack/react-query'
import { Id, SaveState } from '@/components/StateManagementCard/types'
import useSaveStateStore from '@/components/StateManagementCard/store'

// TODO: cleanup!


function StateManagementCard() {
  const { forkClient } = useGrpcContext()

  const saveStateStore = useSaveStateStore()

  const saveStateMutation = useMutation(async () => {
    try {
      const newSaveState = await forkClient.saveState({}).response
      saveStateStore.createSaveState({
        name: '',
        timestamp: Date.now(),
        state: newSaveState.state
      })
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

  const renameStateMutation = useMutation(async (id: Id) => {
    try {
      const saveState = saveStateStore.saveStates.get(id)
      if (!saveState) throw Error(`saveState ${id} not found`)

      let input = prompt(`Enter name for save state`, ``)
      if (!input) return

      saveStateStore.updateSaveState(id, {
        name: input,
        timestamp: saveState.timestamp,
        state: saveState.state
      })
    } catch (e: any) {
      if (e.message != 'unexpected response content type: application/grpc') throw e
    }
  }, {
    onError: (e: any) => alert(e.message)
  })

  const deleteStateMutation = useMutation(async (id: Id) => {
    try {
      if (window.confirm('Delete this state?')) saveStateStore.deleteSaveSate(id)
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

  const importStateMutation = useMutation(async () => {
    try {
      const input = prompt(`Paste saveState here`, ``)
      if (!input) return
      const newSaveState = JSON.parse(input) as SaveState
      saveStateStore.createSaveState(newSaveState)
    } catch (e: any) {
      if (e.message != 'unexpected response content type: application/grpc') throw e
    }
  }, {
    onError: (e: any) => alert(e.message)
  })

  const handleCopy = (id: Id) => {
    const saveState = saveStateStore.saveStates.get(id)
    if (!saveState) throw Error(`saveState ${id} not found`)
    navigator.clipboard.writeText(JSON.stringify(saveState)).then(
      () => alert('State as hex string copied to clipboard'))
  }

  return <Card title={'Manage State'}>
    <div className='flex h-80 flex-col place-content-between'>
      <div className={'max-h-48 overflow-y-auto px-2'}>
        {
          Array.from(saveStateStore.saveStates).map(([id, saveState]: [Id, SaveState], index) => {
            return (
              <div className={'flex flex-row items-center place-content-between space-x-4 mb-2'} key={index}>
                <div className={'flex flex-row items-center place-content-between space-x-4'}>
                  <SaveStateName saveState={saveState} />
                  <Button color={'transparent'} onClick={() => renameStateMutation.mutate(id)}>📝</Button>
                </div>
                <div>
                  <Button color={'transparent'} onClick={() => handleCopy(id)}>📋</Button>
                  <Button color={'transparent'} onClick={() => deleteStateMutation.mutate(id)}>❌</Button>
                  <Button isLoading={loadStateMutation.isLoading}
                          onClick={() => loadStateMutation.mutate(saveState.state)}>Load</Button>
                </div>
              </div>
            )
          })}
      </div>
      <div className={'flex flex-col place-content-between space-y-2'}>
        <Button width={'full'} isLoading={saveStateMutation.isLoading}
                onClick={() => saveStateMutation.mutate()}>Save</Button>
        <Button width={'full'} onClick={() => importStateMutation.mutate()}
                isLoading={resetStateMutation.isLoading}>Import</Button>
        <Button width={'full'} color='red' onClick={() => resetStateMutation.mutate()}
                isLoading={resetStateMutation.isLoading}>Reset</Button>
      </div>
    </div>
  </Card>
}

export default StateManagementCard

function SaveStateName(props: { saveState: SaveState }) {
  return <>
    {props.saveState.name && props.saveState.name !== '' ? <div>{props.saveState.name}</div> :
      <div>{new Date(props.saveState.timestamp).toLocaleString()}</div>}
  </>
}
