import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PatientsPage from './pages/PatientsPage'
import ProfessionalsPage from './pages/ProfessionalsPage'
import AgendaPage from './pages/AgendaPage'
import FinancePage from './pages/FinancePage'
import ServicesPage from './pages/ServicesPage'
import PlansPage from './pages/PlansPage'

function ProtectedRoute({ page, children }) {
  const { user, canAccess } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!canAccess(page)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute page="dashboard"><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/pacientes" element={
          <ProtectedRoute page="pacientes"><PatientsPage /></ProtectedRoute>
        } />
        <Route path="/agenda" element={
          <ProtectedRoute page="agenda"><AgendaPage /></ProtectedRoute>
        } />
        <Route path="/profissionais" element={
          <ProtectedRoute page="profissionais"><ProfessionalsPage /></ProtectedRoute>
        } />
        <Route path="/financeiro" element={
          <ProtectedRoute page="financeiro"><FinancePage /></ProtectedRoute>
        } />
        <Route path="/servicos" element={
          <ProtectedRoute page="servicos"><ServicesPage /></ProtectedRoute>
        } />
        <Route path="/planos" element={
          <ProtectedRoute page="planos"><PlansPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}
