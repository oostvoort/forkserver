import Button from '@/components/Button'
import useConfigStore from '@/config/store'

function ConfigButton() {

  const configStore = useConfigStore()

  function handleOnClick() {
    let input = prompt(`Enter forkserver config: "endpoint, chainId"`,
      `${configStore.forkServerEndpoint}, ${configStore.forkChainId}`)
    if (!input) return
    let args = input.split(',').map(arg => arg.replace(' ', ''))
    configStore.updateForkServerEndpoint(args[0])
    configStore.updateForkChainId(args[1])
  }

  return <Button onClick={handleOnClick} color={'transparent'}>⚙</Button>
}

export default ConfigButton
