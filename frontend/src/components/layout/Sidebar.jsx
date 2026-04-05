import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'

// ── Styled Components ────────────────────────────────────
const SidebarWrapper = styled.aside`
  width: ${({ theme }) => theme.sidebar.width};
  background: ${({ theme }) => theme.colors.b1};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 4px 0 24px rgba(30,60,80,.18);
`

const Brand = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  display: flex;
  align-items: center;
  gap: 12px;
`

const BrandIcon = styled.div`
  width: 34px;
  height: 34px;
  background: ${({ theme }) => theme.colors.b3};
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(46,154,196,.4);
`

const BrandName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -.3px;
`

const BrandSub = styled.span`
  font-size: 10px;
  color: rgba(255,255,255,.4);
  display: block;
`

const Nav = styled.nav`
  padding: 12px 0;
  flex: 1;
  overflow-y: auto;
`

const NavSection = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,.28);
  padding: 10px 18px 4px;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 12.5px;
  color: rgba(255,255,255,.5);
  border-left: 2px solid transparent;
  transition: all .15s;
  user-select: none;
  margin: 1px 8px 1px 0;
  border-radius: 0 6px 6px 0;

  &:hover {
    background: rgba(255,255,255,.06);
    color: rgba(255,255,255,.8);
  }

  &.active {
    color: #fff;
    border-left-color: ${({ theme }) => theme.colors.amber};
    background: rgba(46,154,196,.22);
    font-weight: 600;
  }

  svg { flex-shrink: 0; opacity: .65; }
  &.active svg { opacity: 1; }
`

const UserFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid rgba(255,255,255,.08);
  display: flex;
  align-items: center;
  gap: 9px;
`

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.b3};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
`

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const UserName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserRole = styled.div`
  font-size: 10px;
  color: rgba(255,255,255,.38);
`

const SwitchBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255,255,255,.35);
  padding: 4px;
  border-radius: 6px;
  transition: all .15s;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  &:hover { color: rgba(255,255,255,.8); }
`

// ── Nav config ───────────────────────────────────────────
const ADMIN_NAV = [
  { section: 'Geral', items: [
    { to: '/dashboard',     label: 'Dashboard',             icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="7" width="3.5" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="5.5" y="3" width="3.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="10" y="1" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
    { to: '/agenda',        label: 'Agenda',                icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 1v2M10 1v2M1 5.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { to: '/pacientes',     label: 'Pacientes',             icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 13c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { to: '/profissionais', label: 'Profissionais',         icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="10" cy="4.5" r="1.7" stroke="currentColor" strokeWidth="1.3"/><path d="M1 12.5c0-2.485 1.79-4.5 4-4.5s4 2.015 4 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M10.5 8.5c1.7.3 2.8 1.7 2.8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  ]},
  { section: 'Gestão', items: [
    { to: '/financeiro',    label: 'Receitas & Pagamentos', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h12" stroke="currentColor" strokeWidth="1.3"/><circle cx="4" cy="9" r="1" fill="currentColor"/></svg> },
    { to: '/servicos',      label: 'Serviços',              icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 7h6M4 4.5h6M4 9.5h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { to: '/planos',        label: 'Planos & Descontos',    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l1.5 3.3 3.7.5-2.6 2.5.6 3.7L7 9.8l-3.2 1.7.6-3.7L1.8 5.3l3.7-.5L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  ]},
]

const PROF_NAV = [
  { section: 'Meu espaço', items: [
    { to: '/dashboard',     label: 'Meu Dashboard',      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="7" width="3.5" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="5.5" y="3" width="3.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="10" y="1" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
    { to: '/agenda',        label: 'Minha Agenda',       icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 1v2M10 1v2M1 5.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { to: '/pacientes',     label: 'Meus Pacientes',     icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 13c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { to: '/profissionais', label: 'Meu Perfil',         icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 13c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  ]},
  { section: 'Clínica', items: [
    { to: '/servicos',      label: 'Serviços',           icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 7h6M4 4.5h6M4 9.5h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { to: '/planos',        label: 'Planos & Descontos', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l1.5 3.3 3.7.5-2.6 2.5.6 3.7L7 9.8l-3.2 1.7.6-3.7L1.8 5.3l3.7-.5L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  ]},
]

// ── Component ────────────────────────────────────────────
export default function Sidebar() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const navSections = isAdmin ? ADMIN_NAV : PROF_NAV
  const initials = user?.nome?.split(' ').filter(Boolean).map(w => w[0]).slice(0,2).join('').toUpperCase() || 'U'

  const handleSwitch = () => {
    signOut()
    navigate('/login')
  }

  return (
    <SidebarWrapper>
      <Brand>
        <BrandIcon>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v14M2 9h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
        </BrandIcon>
        <div>
          <BrandName>VitaClin</BrandName>
          <BrandSub>Gestão integrada</BrandSub>
        </div>
      </Brand>

      <Nav>
        {navSections.map(sec => (
          <div key={sec.section}>
            <NavSection>{sec.section}</NavSection>
            {sec.items.map(item => (
              <NavItem key={item.to} to={item.to}>
                {item.icon}
                {item.label}
              </NavItem>
            ))}
          </div>
        ))}
      </Nav>

      <UserFooter>
        <UserAvatar>{initials}</UserAvatar>
        <UserInfo>
          <UserName>{user?.nome}</UserName>
          <UserRole>{user?.role === 'admin' ? 'Administradora' : user?.profNome?.split(' ')[0]}</UserRole>
        </UserInfo>
        <SwitchBtn onClick={handleSwitch} title="Trocar usuário">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M12 5.5l-.5 1.5-1.5-.5M2 8.5l.5-1.5 1.5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </SwitchBtn>
      </UserFooter>
    </SidebarWrapper>
  )
}
