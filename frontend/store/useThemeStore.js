import { create } from 'zustand'
import { persist } from 'zustand/middleware'
const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'coffee',
      setTheme: (theme) => {
        set({ theme })
      },
    }),
    {
      name: 'mostaTheme',
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
)

export default useThemeStore
