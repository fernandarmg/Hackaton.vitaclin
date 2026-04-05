import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'

const Bar = styled.div`
  height: ${({ theme }) => theme.topbar.height};
  background: #fff;
  border-bottom: 1px solid ${({ theme }) => theme.colors.g200};
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`

const Title = styled.h1`
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -.4px;
  color: ${({ theme }) => theme.colors.g900};
`

const DateBadge = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.g500};
  background: ${({ theme }) => theme.colors.g100};
  padding: 3px 9px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.g200};
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all .15s;

  &:hover {
    background: ${({ theme }) => theme.colors.g50};
    border-color: ${({ theme }) => theme.colors.g200};
  }
`

const Avatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.b5};
  color: ${({ theme }) => theme.colors.b1};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
`

const UserName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.g800};
`

const RoleBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  background: ${({ $admin, theme }) => $admin ? theme.colors.b5 : theme.colors.amberL};
  color: ${({ $admin, theme }) => $admin ? theme.colors.b1 : theme.colors.amberD};
`

const Btn = styled.button`
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-family: inherit;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.g300};
  background: #fff;
  color: ${({ theme }) => theme.colors.g700};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all .15s;

  &:hover {
    background: ${({ theme }) => theme.colors.g50};
    border-color: ${({ theme }) => theme.colors.g400};
  }
`

const BtnPrimary = styled(Btn)`
  background: ${({ theme }) => theme.colors.b3};
  color: #fff;
  border-color: ${({ theme }) => theme.colors.b3};
  box-shadow: 0 2px 8px rgba(46,154,196,.28);

  &:hover {
    background: ${({ theme }) => theme.colors.b2};
    border-color: ${({ theme }) => theme.colors.b2};
  }
`

const TITLES = {
  '/dashboard':     'Dashboard',
  '/agenda':        'Agenda',
  '/pacientes':     'Pacientes',
  '/profissionais': 'Profissionais',
  '/financeiro':    'Receitas & Pagamentos',
  '/servicos':      'Serviços',
  '/planos':        'Planos & Descontos',
}

const TITLES_PROF = {
  '/dashboard':     'Meu Dashboard',
  '/agenda':        'Minha Agenda',
  '/pacientes':     'Meus Pacientes',
  '/profissionais': 'Meu Perfil',
  '/servicos':      'Serviços',
  '/planos':        'Planos & Descontos',
}

export default function Topbar() {
  const { user, isAdmin, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const titles = isAdmin ? TITLES : TITLES_PROF
  const title = titles[location.pathname] || 'VitaClin'
  const initials = user?.nome?.split(' ').filter(Boolean).map(w => w[0]).slice(0,2).join('').toUpperCase() || 'U'
  const date = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const shortName = user?.nome?.split(' ')[0] || ''

  return (
    <Bar>
      <TitleGroup>
        <Title>{title}</Title>
        <DateBadge>{date}</DateBadge>
      </TitleGroup>
      <Right>
        <UserChip onClick={() => { signOut(); navigate('/login') }}>
          <Avatar>{initials}</Avatar>
          <UserName>{shortName}</UserName>
          <RoleBadge $admin={isAdmin}>{isAdmin ? 'Admin' : 'Profissional'}</RoleBadge>
        </UserChip>
        <Btn onClick={() => navigate('/agenda')}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M4 1v2M8 1v2M1 5h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Agenda
        </Btn>
        {isAdmin && (
          <BtnPrimary onClick={() => navigate('/pacientes')}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Novo paciente
          </BtnPrimary>
        )}
      </Right>
    </Bar>
  )
}
