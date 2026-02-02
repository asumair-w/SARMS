import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'sarms_lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) || 'en').replace(/"/g, '')
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {}
    const root = document.documentElement
    root.setAttribute('lang', lang === 'ar' ? 'ar' : 'en')
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  }, [lang])

  function setLang(value) {
    setLangState(value === 'ar' ? 'ar' : 'en')
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
