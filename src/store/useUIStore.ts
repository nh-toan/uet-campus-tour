import { create } from 'zustand'

export interface UIState {
  drawer: {
    open: boolean
    tab: 'about' | 'faculty' | 'club'
  }
  lang: 'vi' | 'en'
  theme: 'day' | 'night'
  openDrawer: (tab: UIState['drawer']['tab']) => void
  closeDrawer: () => void
  setLang: (lang: UIState['lang']) => void
  setTheme: (theme: UIState['theme']) => void
}

export const useUIStore = create<UIState>((set) => ({
  drawer: {
    open: false,
    tab: 'about',
  },
  lang: 'vi',
  theme: 'day',
  openDrawer: (tab) => set({ drawer: { open: true, tab } }),
  closeDrawer: () =>
    set((state) => ({ drawer: { ...state.drawer, open: false } })),
  setLang: (lang) => set({ lang }),
  setTheme: (theme) => set({ theme }),
}))
