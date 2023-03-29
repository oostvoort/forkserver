export type SaveState = { name: string, timestamp: number, state: string }

export type Id = string

export interface SaveStateStore {
  saveStates: Map<Id, SaveState>,
  createSaveState: (saveState: SaveState) => void,
  updateSaveState: (id: Id, saveState: SaveState) => void,
  deleteSaveSate: (id: Id) => void,
  reset: () => void
}