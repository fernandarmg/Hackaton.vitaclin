import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
})

// ── Auth ─────────────────────────────────────────────────
export const login = (email, senha) =>
  api.post('/users/login', { email, senha }).then(r => r.data)

// ── Patients ─────────────────────────────────────────────
export const getPatients   = (params = {}) => api.get('/patients/',      { params }).then(r => r.data)
export const getPatient    = (id)           => api.get(`/patients/${id}`).then(r => r.data)
export const createPatient = (data)         => api.post('/patients/', data).then(r => r.data)
export const updatePatient = (id, data)     => api.put(`/patients/${id}`, data).then(r => r.data)
export const deletePatient = (id)           => api.delete(`/patients/${id}`)

// ── Professionals ────────────────────────────────────────
export const getProfessionals   = ()         => api.get('/professionals/').then(r => r.data)
export const getProfessional    = (id)       => api.get(`/professionals/${id}`).then(r => r.data)
export const createProfessional = (data)     => api.post('/professionals/', data).then(r => r.data)
export const updateProfessional = (id, data) => api.put(`/professionals/${id}`, data).then(r => r.data)
export const deleteProfessional = (id)       => api.delete(`/professionals/${id}`)

// ── Appointments ─────────────────────────────────────────
export const getAppointments    = (params = {}) => api.get('/appointments/', { params }).then(r => r.data)
export const createAppointment  = (data)         => api.post('/appointments/', data).then(r => r.data)
export const confirmAppointment = (id)           => api.patch(`/appointments/${id}/confirm`).then(r => r.data)
export const deleteAppointment  = (id)           => api.delete(`/appointments/${id}`)

// ── Finances ─────────────────────────────────────────────
export const getFinances       = (params = {}) => api.get('/finances/',        { params }).then(r => r.data)
export const getFinanceSummary = ()             => api.get('/finances/summary').then(r => r.data)
export const createFinance     = (data)         => api.post('/finances/', data).then(r => r.data)
export const updateFinance     = (id, data)     => api.put(`/finances/${id}`, data).then(r => r.data)
export const deleteFinance     = (id)           => api.delete(`/finances/${id}`)

export default api
