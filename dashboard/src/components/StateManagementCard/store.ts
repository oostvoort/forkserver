import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Id, SaveState, SaveStateStore } from '@/components/StateManagementCard/types'
import { v4 as uuid } from 'uuid'

const useSaveStateStore = create<SaveStateStore>()(
  persist(
    (set, get) => ({
      saveStates: new Map<Id, SaveState>(),
      createSaveState: (saveState: SaveState) => set((state) => {
        const updatedItems = get().saveStates
        updatedItems.set(uuid(), saveState)
        return {
          saveStates: updatedItems
        }
      }),
      updateSaveState: (id: Id, saveState: SaveState) => set((state) => {
        const updatedItems = new Map(state.saveStates)
        updatedItems.set(id, saveState)
        return {
          saveStates: updatedItems
        }
      }),
      deleteSaveSate: (id: Id) => set((state) => {
        const updatedItems = new Map(state.saveStates)
        updatedItems.delete(id)
        return {
          saveStates: updatedItems
        }
      }),
      reset: () => set(() => ({
        saveStates: new Map<Id, SaveState>()
      }))
    }),
    {
      name: 'save-state-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          return {
            state: {
              saveStates: new Map(JSON.parse(str).state.saveStates)
            }
          }
        },
        setItem: (name, newValue) => {
          const str: string = JSON.stringify({
            state: {
              ...newValue.state,
              saveStates: Array.from(newValue.state.saveStates.entries())
            }
          })
          localStorage.setItem(name, str)
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)

export default useSaveStateStore