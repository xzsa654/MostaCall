'use client'
import './globals.css'
import Navbar from './components/navbar'
import useThemeStore from '@/store/useThemeStore'
import ComponentsSetupModal from './components/setup-modal'
import useAuthStore from '@/store/useAuthStore'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
export default function ClientLayout({ children }) {
  const { theme } = useThemeStore()
  const { initialize } = useAuthStore()
  useEffect(() => {
    initialize()
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return (
    <>
      <Navbar />
      {children}
      <ComponentsSetupModal />
      <Toaster />
    </>
  )
}
