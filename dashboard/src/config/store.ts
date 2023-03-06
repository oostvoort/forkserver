import { create } from 'zustand'
import { ENV } from '@/config/constants'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ConfigState {
  forkServerEndpoint: string
  updateForkServerEndpoint: (newForkServerEndpoint: string) => void
  forkChainId: string
  updateForkChainId: (newForkChainId: string) => void
}

const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      forkServerEndpoint: ENV.FORK_SERVER_ENDPOINT,
      updateForkServerEndpoint: (newForkServerEndpoint: string) => set(
        () => ({ forkServerEndpoint: newForkServerEndpoint })),
      forkChainId: ENV.FORK_CHAIN_ID,
      updateForkChainId: (newForkChainId: string) => set(
        () => ({ forkChainId: newForkChainId }))
    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)


export default useConfigStore
