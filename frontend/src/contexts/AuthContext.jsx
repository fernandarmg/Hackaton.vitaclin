import { createContext, useContext, useState } from 'react'
import { login as apiLogin } from '../services/api'

const AuthContext = createContext(null)

const DEMO_FALLBACK = [
  { id:'demo-admin', nome:'Renata Souza',       email:'renata@vitaclin.com',  senha:'admin123',   role:'admin',        profNome:null },
  { id:'demo-camila',nome:'Dra. Camila Torres', email:'camila@vitaclin.com',  senha:'camila123',  role:'profissional', profNome:'Dra. Camila Torres' },
  { id:'demo-rafael',nome:'Dr. Rafael Nunes',   email:'rafael@vitaclin.com',  senha:'rafael123',  role:'profissional', profNome:'Dr. Rafael Nunes' },
  { id:'demo-beatriz',nome:'Dra. Beatriz Lemos',email:'beatriz@vitaclin.com', senha:'beatriz123', role:'profissional', profNome:'Dra. Beatriz Lemos' },
  { id:'demo-andre', nome:'Dr. André Melo',     email:'andre@vitaclin.com',   senha:'andre123',   role:'profissional', profNome:'Dr. André Melo' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const signIn = async (email, senha) => {
    try {
      const data = await apiLogin(email, senha)
      setUser(data)
      return data
    } catch {
      // Backend indisponível — usa credenciais demo locais
      const found = DEMO_FALLBACK.find(u => u.email === email && u.senha === senha)
      if (!found) throw new Error('Credenciais inválidas')
      const { senha: _, ...data } = found
      setUser(data)
      return data
    }
  }

  const signOut = () => setUser(null)

  const isAdmin = user?.role === 'admin'
  const isProfissional = user?.role === 'profissional'
  const profNome = user?.profNome || null

  const canAccess = (page) => {
    if (!user) return false
    const adminPages = ['dashboard','agenda','pacientes','profissionais','financeiro','servicos','planos']
    const profPages  = ['dashboard','agenda','pacientes','profissionais','servicos','planos']
    return isAdmin ? adminPages.includes(page) : profPages.includes(page)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAdmin, isProfissional, profNome, canAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
