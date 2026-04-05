import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

const Screen = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.b1} 0%, ${({ theme }) => theme.colors.b3} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoginCard = styled.div`
  background: #fff;
  border-radius: ${({ theme }) => theme.radii.xxl};
  padding: 40px 44px;
  width: 420px;
  max-width: 92vw;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`

const LogoIcon = styled.div`
  width: 42px;
  height: 42px;
  background: ${({ theme }) => theme.colors.b3};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(46,154,196,.35);
`

const LogoTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.b1};
  letter-spacing: -.5px;
`

const LogoSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.g500};
`

const SectionLabel = styled.p`
  font-size: 11.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.g600};
  text-transform: uppercase;
  letter-spacing: .4px;
  margin-bottom: 14px;
`

const UserCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
`

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.b3 : theme.colors.g200};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all .18s;
  background: ${({ $selected, theme }) => $selected ? theme.colors.b5 + '40' : '#fff'};
  box-shadow: ${({ $selected, theme }) => $selected ? '0 0 0 3px rgba(46,154,196,.14)' : 'none'};

  &:hover {
    border-color: ${({ theme }) => theme.colors.b4};
    background: ${({ theme }) => theme.colors.b5 + '30'};
  }
`

const UserAv = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.b5};
  color: ${({ theme }) => theme.colors.b1};
`

const UserCardName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.g900};
`

const UserCardRole = styled.div`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.g500};
  margin-top: 2px;
`

const RolePill = styled.span`
  margin-left: auto;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  flex-shrink: 0;
  background: ${({ $admin, theme }) => $admin ? theme.colors.b5 : theme.colors.amberL};
  color: ${({ $admin, theme }) => $admin ? theme.colors.b1 : theme.colors.amberD};
`

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.b3};
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  transition: all .15s;
  box-shadow: 0 2px 10px rgba(46,154,196,.3);

  &:hover { background: ${({ theme }) => theme.colors.b2}; }
  &:disabled { background: ${({ theme }) => theme.colors.g300}; box-shadow: none; cursor: not-allowed; }
`

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.red};
  font-size: 12px;
  text-align: center;
  margin-top: 10px;
`

const DEMO_USERS = [
  { email: 'renata@vitaclin.com',  senha: 'admin123',   nome: 'Renata Souza',       role: 'admin',        initials: 'RS' },
  { email: 'camila@vitaclin.com',  senha: 'camila123',  nome: 'Dra. Camila Torres', role: 'profissional', initials: 'CT' },
]

const FieldLabel = styled.label`
  display: block; font-size: 11px; font-weight: 700;
  color: ${({ theme }) => theme.colors.g600};
  text-transform: uppercase; letter-spacing: .4px; margin-bottom: 5px;
`
const FieldInput = styled.input`
  width: 100%; padding: 10px 12px; border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.g200};
  font-size: 13.5px; font-family: inherit; outline: none;
  background: #f8fafc; box-sizing: border-box; color: #253540;
  transition: border-color .15s;
  &:focus { border-color: ${({ theme }) => theme.colors.b3}; background: #fff; }
`
const FieldWrap = styled.div` margin-bottom: 12px; `

export default function LoginPage() {
  const [selected, setSelected] = useState(0)
  const [email, setEmail]       = useState(DEMO_USERS[0].email)
  const [senha, setSenha]       = useState(DEMO_USERS[0].senha)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const handleSelect = (i) => {
    setSelected(i)
    setEmail(DEMO_USERS[i].email)
    setSenha(DEMO_USERS[i].senha)
    setError('')
  }

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await signIn(email, senha)
      navigate('/dashboard')
    } catch {
      setError('E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <LoginCard>
        <Logo>
          <LogoIcon>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v14M2 9h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
            </svg>
          </LogoIcon>
          <div>
            <LogoTitle>VitaClin</LogoTitle>
            <LogoSub>Gestão integrada de saúde</LogoSub>
          </div>
        </Logo>

        <SectionLabel>Entrar como</SectionLabel>

        <UserCards>
          {DEMO_USERS.map((u, i) => (
            <UserCard key={u.email} $selected={selected === i} onClick={() => handleSelect(i)}>
              <UserAv>{u.initials}</UserAv>
              <div>
                <UserCardName>{u.nome}</UserCardName>
                <UserCardRole>{u.role === 'admin' ? 'Administradora · Acesso completo' : 'Fisioterapia · Acesso restrito'}</UserCardRole>
              </div>
              <RolePill $admin={u.role === 'admin'}>{u.role === 'admin' ? 'Admin' : 'Profissional'}</RolePill>
            </UserCard>
          ))}
        </UserCards>

        <FieldWrap>
          <FieldLabel>E-mail</FieldLabel>
          <FieldInput value={email} onChange={e => setEmail(e.target.value)} placeholder="email@vitaclin.com"/>
        </FieldWrap>
        <FieldWrap>
          <FieldLabel>Senha</FieldLabel>
          <FieldInput type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••"/>
        </FieldWrap>

        <LoginButton onClick={handleLogin} disabled={loading} style={{marginTop:4}}>
          {loading ? 'Entrando...' : 'Entrar na plataforma'}
        </LoginButton>
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </LoginCard>
    </Screen>
  )
}
