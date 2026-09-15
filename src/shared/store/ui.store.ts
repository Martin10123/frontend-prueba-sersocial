import { create } from "zustand"

type UiState = {
  loginOpen: boolean
  openLogin: () => void
  closeLogin: () => void
}

export const useUiStore = create<UiState>((set) => ({
  loginOpen: false,
  openLogin: () => set({ loginOpen: true }),
  closeLogin: () => set({ loginOpen: false }),
}))
