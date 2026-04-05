import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 3000,
})

// ── Mock data (fallback quando backend indisponível) ──────
const MOCK = {
  patients: [
    {id:'m1',nome:'Ana Beatriz Ferreira',cont:'(11) 9 8421-3302',nasc:'1990-04-12',esp:'Fisioterapia',prof:'Dra. Camila Torres',plano:'Premium',freqPresc:'2x/semana',obs:'Pós-operatório de joelho direito. Boa evolução funcional.',peso:'68kg',altura:'1,65m',sangue:'A+',lastVisit:'2026-04-02',visitCount:14},
    {id:'m2',nome:'Carlos Eduardo Lima',cont:'(11) 9 7133-0041',nasc:'1985-11-23',esp:'Nutrição',prof:'Dr. Rafael Nunes',plano:'Fidelidade',freqPresc:'Semanal',obs:'Diabetes tipo 2. Controle glicêmico em melhora.',peso:'92kg',altura:'1,78m',sangue:'O+',lastVisit:'2026-04-02',visitCount:18},
    {id:'m3',nome:'Fernanda Costa Alves',cont:'(11) 9 9200-8821',nasc:'1998-07-05',esp:'Psicologia',prof:'Dra. Beatriz Lemos',plano:'Premium',freqPresc:'Semanal',obs:'Ansiedade generalizada. Boa adesão à TCC.',peso:'58kg',altura:'1,62m',sangue:'B-',lastVisit:'2026-03-27',visitCount:11},
    {id:'m4',nome:'Roberto Mendonça',cont:'(11) 9 6543-1100',nasc:'1975-02-18',esp:'Fisioterapia',prof:'Dra. Camila Torres',plano:'Básico',freqPresc:'Quinzenal',obs:'Lombalgia crônica. Manutenção funcional.',peso:'84kg',altura:'1,75m',sangue:'AB+',lastVisit:'2026-02-26',visitCount:6},
    {id:'m5',nome:'Juliana Martins',cont:'(11) 9 8812-4456',nasc:'2001-09-30',esp:'Nutrição',prof:'Dr. Rafael Nunes',plano:'Premium',freqPresc:'Quinzenal',obs:'Reeducação alimentar. Perda de 3kg no trimestre.',peso:'72kg',altura:'1,68m',sangue:'O-',lastVisit:'2026-04-01',visitCount:12},
    {id:'m6',nome:'Marcelo Souza',cont:'(11) 9 9911-2233',nasc:'1988-03-15',esp:'Psicologia',prof:'Dra. Beatriz Lemos',plano:'Premium',freqPresc:'Semanal',obs:'Depressão leve. Evolução positiva nas últimas sessões.',peso:'79kg',altura:'1,80m',sangue:'A-',lastVisit:'2026-04-02',visitCount:9},
    {id:'m7',nome:'Patrícia Almeida',cont:'(11) 9 7654-3210',nasc:'1992-08-22',esp:'Fisioterapia',prof:'Dra. Camila Torres',plano:'Fidelidade',freqPresc:'2x/semana',obs:'Hérnia de disco L4-L5. Protocolo conservador.',peso:'65kg',altura:'1,62m',sangue:'B+',lastVisit:'2026-04-01',visitCount:16},
    {id:'m8',nome:'Gabriel Teixeira',cont:'(11) 9 9001-2233',nasc:'2000-05-19',esp:'Nutrição',prof:'Dr. Rafael Nunes',plano:'Fidelidade',freqPresc:'Semanal',obs:'Alto rendimento esportivo. Periodização nutricional.',peso:'78kg',altura:'1,83m',sangue:'O+',lastVisit:'2026-04-02',visitCount:20},
    {id:'m9',nome:'Thiago Nascimento',cont:'(11) 9 8765-4321',nasc:'1989-03-08',esp:'Psicologia',prof:'Dra. Beatriz Lemos',plano:'Fidelidade',freqPresc:'Semanal',obs:'Burnout e estresse crônico. Melhora no padrão de sono.',peso:'82kg',altura:'1,77m',sangue:'O-',lastVisit:'2026-03-31',visitCount:15},
    {id:'m10',nome:'Isabela Rodrigues',cont:'(11) 9 9876-5432',nasc:'1993-06-17',esp:'Fisioterapia',prof:'Dra. Camila Torres',plano:'Fidelidade',freqPresc:'2x/semana',obs:'Tendinite no ombro direito. Boa resposta ao ultrassom.',peso:'61kg',altura:'1,60m',sangue:'A+',lastVisit:'2026-04-02',visitCount:13},
    {id:'m11',nome:'Diego Barbosa',cont:'(11) 9 6655-4433',nasc:'1987-07-25',esp:'Fisioterapia',prof:'Dra. Camila Torres',plano:'Premium',freqPresc:'2x/semana',obs:'Reabilitação pós-fratura de tornozelo.',peso:'88kg',altura:'1,80m',sangue:'AB-',lastVisit:'2026-04-01',visitCount:10},
    {id:'m12',nome:'Felipe Cunha',cont:'(11) 9 7766-5544',nasc:'1991-12-28',esp:'Psicologia',prof:'Dra. Beatriz Lemos',plano:'Premium',freqPresc:'Semanal',obs:'TAG. Técnicas de mindfulness incorporadas à rotina.',peso:'77kg',altura:'1,75m',sangue:'A+',lastVisit:'2026-04-01',visitCount:11},
    {id:'m13',nome:'Bruno Cavalcanti',cont:'(11) 9 5533-8899',nasc:'1983-08-07',esp:'Fisioterapia',prof:'Dr. André Melo',plano:'Fidelidade',freqPresc:'2x/semana',obs:'Gonartrose bilateral. Fortalecimento de quadríceps.',peso:'95kg',altura:'1,76m',sangue:'AB+',lastVisit:'2026-04-02',visitCount:17},
    {id:'m14',nome:'Bianca Mendes',cont:'(11) 9 9922-7788',nasc:'2003-07-11',esp:'Fisioterapia',prof:'Dra. Camila Torres',plano:'Premium',freqPresc:'2x/semana',obs:'Lesão ligamentar no tornozelo. Paciente recente.',peso:'52kg',altura:'1,58m',sangue:'B+',lastVisit:'2026-04-03',visitCount:5},
    {id:'m15',nome:'Lucas Ferreira',cont:'(11) 9 8833-6677',nasc:'1995-01-17',esp:'Nutrição',prof:'Dr. Rafael Nunes',plano:'Premium',freqPresc:'Semanal',obs:'Ganho de massa muscular. Plano hipercalórico.',peso:'74kg',altura:'1,80m',sangue:'O+',lastVisit:'2026-04-03',visitCount:6},
    {id:'m16',nome:'Natália Freitas',cont:'(11) 9 7711-2200',nasc:'1999-05-05',esp:'Fisioterapia',prof:'Dr. André Melo',plano:'Fidelidade',freqPresc:'2x/semana',obs:'Escoliose leve. Pilates clínico 2x/semana.',peso:'57kg',altura:'1,63m',sangue:'B-',lastVisit:'2026-04-02',visitCount:13},
    {id:'m17',nome:'Paulo Henrique Dias',cont:'(11) 9 6600-9988',nasc:'1980-06-30',esp:'Nutrição',prof:'Dr. Rafael Nunes',plano:'Fidelidade',freqPresc:'Semanal',obs:'Obesidade grau 1, hipertensão.',peso:'105kg',altura:'1,74m',sangue:'B+',lastVisit:'2026-02-28',visitCount:9},
    {id:'m18',nome:'Camila Ramos',cont:'(11) 9 8822-5566',nasc:'1993-09-28',esp:'Psicologia',prof:'Dra. Beatriz Lemos',plano:'Fidelidade',freqPresc:'Semanal',obs:'TDAH adulto. Psicoeducação e TCC.',peso:'66kg',altura:'1,65m',sangue:'A+',lastVisit:'2026-04-02',visitCount:12},
  ],
  professionals: [
    {id:'p1',nome:'Dra. Camila Torres',esp:'Fisioterapia',crm:'CREFITO 12.345-F',sala:'Sala 1 — Fisioterapia',bio:'Fisioterapeuta com 12 anos de experiência em reabilitação ortopédica e esportiva.',formacao:'USP — Esp. Fisioterapia Ortopédica UNICAMP'},
    {id:'p2',nome:'Dr. Rafael Nunes',esp:'Nutrição',crm:'CRN-3 54.321',sala:'Sala 2 — Nutrição',bio:'Nutricionista especializado em nutrição funcional e terapêutica metabólica.',formacao:'UNIFESP — Pós-graduação Nutrição Funcional VP'},
    {id:'p3',nome:'Dra. Beatriz Lemos',esp:'Psicologia',crm:'CRP 06/98765',sala:'Sala 3 — Psicologia',bio:'Psicóloga clínica com abordagem cognitivo-comportamental.',formacao:'PUC-SP — Especialização TCC Instituto Beck Brasil'},
    {id:'p4',nome:'Dr. André Melo',esp:'Fisioterapia',crm:'CREFITO 18.902-F',sala:'Sala 4 — Fisioterapia',bio:'Fisioterapeuta especializado em reabilitação esportiva e postural.',formacao:'UNIFESP — Pós-graduação Fisioterapia Esportiva'},
  ],
  appointments: [
    {id:'a1',date:'2026-04-07',time:'08:00',profNome:'Dra. Camila Torres',prof:'Dra. Camila Torres',pacNome:'Ana Beatriz Ferreira',status:'confirmed',sala:'Sala 1'},
    {id:'a2',date:'2026-04-07',time:'09:00',profNome:'Dra. Camila Torres',prof:'Dra. Camila Torres',pacNome:'Patrícia Almeida',status:'confirmed',sala:'Sala 1'},
    {id:'a3',date:'2026-04-07',time:'10:00',profNome:'Dra. Camila Torres',prof:'Dra. Camila Torres',pacNome:'Isabela Rodrigues',status:'confirmed',sala:'Sala 1'},
    {id:'a4',date:'2026-04-07',time:'11:00',profNome:'Dra. Camila Torres',prof:'Dra. Camila Torres',pacNome:'Diego Barbosa',status:'confirmed',sala:'Sala 1'},
    {id:'a5',date:'2026-04-08',time:'08:00',profNome:'Dra. Camila Torres',prof:'Dra. Camila Torres',pacNome:'Roberto Mendonça',status:'pending',sala:'Sala 1'},
    {id:'a6',date:'2026-04-08',time:'09:00',profNome:'Dra. Camila Torres',prof:'Dra. Camila Torres',pacNome:'Bianca Mendes',status:'confirmed',sala:'Sala 1'},
    {id:'a7',date:'2026-04-09',time:'08:00',profNome:'Dra. Camila Torres',prof:'Dra. Camila Torres',pacNome:'Ana Beatriz Ferreira',status:'confirmed',sala:'Sala 1'},
    {id:'a8',date:'2026-04-09',time:'09:00',profNome:'Dra. Camila Torres',prof:'Dra. Camila Torres',pacNome:'Patrícia Almeida',status:'confirmed',sala:'Sala 1'},
    {id:'a9',date:'2026-04-07',time:'09:00',profNome:'Dr. Rafael Nunes',prof:'Dr. Rafael Nunes',pacNome:'Carlos Eduardo Lima',status:'confirmed',sala:'Sala 2'},
    {id:'a10',date:'2026-04-07',time:'10:00',profNome:'Dr. Rafael Nunes',prof:'Dr. Rafael Nunes',pacNome:'Gabriel Teixeira',status:'confirmed',sala:'Sala 2'},
    {id:'a11',date:'2026-04-08',time:'10:00',profNome:'Dr. Rafael Nunes',prof:'Dr. Rafael Nunes',pacNome:'Juliana Martins',status:'confirmed',sala:'Sala 2'},
    {id:'a12',date:'2026-04-08',time:'11:00',profNome:'Dr. Rafael Nunes',prof:'Dr. Rafael Nunes',pacNome:'Lucas Ferreira',status:'pending',sala:'Sala 2'},
    {id:'a13',date:'2026-04-07',time:'10:00',profNome:'Dra. Beatriz Lemos',prof:'Dra. Beatriz Lemos',pacNome:'Fernanda Costa Alves',status:'confirmed',sala:'Sala 3'},
    {id:'a14',date:'2026-04-07',time:'11:00',profNome:'Dra. Beatriz Lemos',prof:'Dra. Beatriz Lemos',pacNome:'Marcelo Souza',status:'confirmed',sala:'Sala 3'},
    {id:'a15',date:'2026-04-07',time:'14:00',profNome:'Dra. Beatriz Lemos',prof:'Dra. Beatriz Lemos',pacNome:'Felipe Cunha',status:'pending',sala:'Sala 3'},
    {id:'a16',date:'2026-04-08',time:'10:00',profNome:'Dra. Beatriz Lemos',prof:'Dra. Beatriz Lemos',pacNome:'Thiago Nascimento',status:'confirmed',sala:'Sala 3'},
    {id:'a17',date:'2026-04-07',time:'07:00',profNome:'Dr. André Melo',prof:'Dr. André Melo',pacNome:'Bruno Cavalcanti',status:'confirmed',sala:'Sala 4'},
    {id:'a18',date:'2026-04-07',time:'08:00',profNome:'Dr. André Melo',prof:'Dr. André Melo',pacNome:'Natália Freitas',status:'confirmed',sala:'Sala 4'},
  ],
  finances: [],
  summary: {},
}

// ── Helpers ───────────────────────────────────────────────
const safe = async (promise, mockKey, params) => {
  try {
    const data = await promise.then(r => r.data)
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return applyParams(MOCK[mockKey] || [], params)
    }
    return data
  } catch {
    return applyParams(MOCK[mockKey] || [], params)
  }
}

const applyParams = (data, params = {}) => {
  if (!Array.isArray(data)) return data
  return data.filter(item => {
    if (params.prof  && item.prof  !== params.prof  && item.profNome !== params.prof)  return false
    if (params.esp   && item.esp   !== params.esp)   return false
    if (params.plano && item.plano !== params.plano) return false
    return true
  })
}

// ── Auth ─────────────────────────────────────────────────
export const login = (email, senha) =>
  api.post('/users/login', { email, senha }).then(r => r.data)

// ── Patients ─────────────────────────────────────────────
export const getPatients   = (params = {}) => safe(api.get('/patients/', { params }), 'patients', params)
export const getPatient    = (id)           => safe(api.get(`/patients/${id}`), null)
export const createPatient = (data)         => api.post('/patients/', data).then(r => r.data).catch(() => ({...data, id: Date.now().toString()}))
export const updatePatient = (id, data)     => api.put(`/patients/${id}`, data).then(r => r.data).catch(() => data)
export const deletePatient = (id)           => api.delete(`/patients/${id}`).catch(() => {})

// ── Professionals ────────────────────────────────────────
export const getProfessionals   = ()          => safe(api.get('/professionals/'), 'professionals', {})
export const getProfessional    = (id)        => safe(api.get(`/professionals/${id}`), null)
export const createProfessional = (data)      => api.post('/professionals/', data).then(r => r.data).catch(() => data)
export const updateProfessional = (id, data)  => api.put(`/professionals/${id}`, data).then(r => r.data).catch(() => data)
export const deleteProfessional = (id)        => api.delete(`/professionals/${id}`).catch(() => {})

// ── Appointments ─────────────────────────────────────────
export const getAppointments    = (params = {}) => safe(api.get('/appointments/', { params }), 'appointments', params)
export const createAppointment  = (data)         => api.post('/appointments/', data).then(r => r.data).catch(() => ({...data, id: Date.now().toString()}))
export const confirmAppointment = (id)           => api.patch(`/appointments/${id}/confirm`).then(r => r.data).catch(() => {})
export const deleteAppointment  = (id)           => api.delete(`/appointments/${id}`).catch(() => {})

// ── Finances ─────────────────────────────────────────────
export const getFinances       = (params = {}) => safe(api.get('/finances/', { params }), 'finances', params)
export const getFinanceSummary = ()             => safe(api.get('/finances/summary'), 'summary', {})
export const createFinance     = (data)         => api.post('/finances/', data).then(r => r.data).catch(() => data)
export const updateFinance     = (id, data)     => api.put(`/finances/${id}`, data).then(r => r.data).catch(() => data)
export const deleteFinance     = (id)           => api.delete(`/finances/${id}`).catch(() => {})

export default api
