import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
  theme: 'light' | 'dark' | 'auto'
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') return true
      if (savedTheme === 'light') return false
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'auto'
    }
    return 'auto'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    setThemeState(newMode ? 'dark' : 'light')
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
  }

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    } else {
      setDarkMode(newTheme === 'dark')
    }
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
