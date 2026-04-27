import { createContext, useContext, useState } from 'react'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('creatink:lang') || 'en')
  const [unread, setUnread] = useState(2) // demo seed

  const changeLang = (l) => { setLang(l); localStorage.setItem('creatink:lang', l) }

  return (
    <AppCtx.Provider value={{ lang, changeLang, unread, setUnread }}>
      {children}
    </AppCtx.Provider>
  )
}

export const useApp = () => useContext(AppCtx)
