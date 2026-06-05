import { createContext } from 'react'

export type ThemeMode = 'light' | 'dark'

export interface ThemeContextValue {
  theme: ThemeMode
  isDarkMode: boolean
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

export const DEFAULT_THEME: ThemeMode = 'light'

export const THEME_STORAGE_KEY = 'new-ra-ising-theme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const isThemeMode = (value: string | null): value is ThemeMode => {
  return value === 'light' || value === 'dark'
}

export const getStoredTheme = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  return isThemeMode(storedTheme) ? storedTheme : DEFAULT_THEME
}

export const applyThemeToDocument = (theme: ThemeMode) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export const persistTheme = (theme: ThemeMode) => {
  if (typeof window === 'undefined') {
    return
  }

  if (theme === DEFAULT_THEME) {
    window.localStorage.removeItem(THEME_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}
