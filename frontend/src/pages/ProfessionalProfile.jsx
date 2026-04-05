import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getPatients, getAppointments } from '../services/api'
import { Badge } from '../components/ui'
import PatientProfile from './PatientProfile'

// ── Styled ────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed; inset: 0; background: #f5f8fa;
  z-index: 200; overflow-y: auto; animation: fadeIn .18s ease;
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
`
const Topbar = styled.div`
  height: 58px; background: #fff; border-bottom: 1px solid #e2eaef;
  padding: 0 24px; display: flex; align-items: center;
  justify-content: space-between; position: sticky; top: 0; z-index: 10;
  box-shadow: 0 1px 4px rgba(46,95,122,.07);
`
const BackBtn = styled.button`
  display: flex; align-items: center; gap: 7px; font-size: 13px;
  font-weight: 600; color: #587080; cursor: pointer; padding: 5px 10px;
  border-radius: 8px; transition: all .15s; border: none; background: transparent;
  &:hover { background: #f0f5f8; color: #2e5f7a; }
`
const Body = styled.div` padding: 24px; max-width: 1100px; margin: 0 auto; `

const Hero = styled.div`
  background: #fff; border: 1px solid #e2eaef; border-radius: 16px;
  padding: 24px; margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(46,95,122,.07);
  display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap;
`
const Av = styled.div`
  width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0;
  background: #cce9f5; color: #2e5f7a;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 700;
`
const StatGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; min-width: 280px;
`
const StatBox = styled.div`
  background: #f5f8fa; border-radius: 12px; padding: 12px 14px;
  text-align: center; border: 1px solid #e8f0f5;
`

const TabBar = styled.div`
  display: flex; background: #fff; border-radius: 16px 16px 0 0;
  padding: 0 18px; border: 1px solid #e2eaef; border-bottom: none;
  overflow-x: auto; gap: 2px;
`
const Tab = styled.button`
  padding: 12px 16px; font-size: 13px; cursor: pointer; white-space: nowrap;
  color: ${({$active}) => $active ? '#2e9ac4' : '#9aaebb'};
  border-bottom: 2px solid ${({$active}) => $active ? '#2e9ac4' : 'transparent'};
  font-weight: 600; border-top: none; border-left: none; border-right: none;
  background: transparent; transition: all .15s; margin-bottom: -1px;
  &:hover { color: #2e5f7a; }
`
const TabBody = styled.div`
  background: #fff; border: 1px solid #e2eaef; border-radius: 0 0 16px 16px;
  padding: 24px; min-height: 220px;
`

// ── Helpers ───────────────────────────────────────────────
const ESP_BADGE = { Fisioterapia:'sky', Nutrição:'teal', Psicologia:'purple' }
const PLANO_BADGE = { Premium:'amber', Fidelidade:'sky', Básico:'navy', Avulso:'gray' }
const initials = n => n?.trim().split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?'
const fmtDate = d => !d ? '—' : d.split('-').reverse().join('/')

// ── Mock schedule: deterministic per professional name ─────
const HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']
const DAYS  = ['Seg','Ter','Qua','Qui','Sex']

function buildSchedule(nome) {
  const seed = nome.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const grid = {}
  DAYS.forEach((d, di) => {
    grid[d] = {}
    HOURS.forEach((h, hi) => {
      // morning slots (08-11): high probability, lunch break (12-13): low, afternoon (14-16): medium
      const hour = parseInt(h)
      let prob = hour >= 8 && hour <= 11 ? 0.85 : hour === 12 ? 0.2 : hour === 13 ? 0.1 : hour >= 14 && hour <= 16 ? 0.7 : 0.3
      if (di === 2 && hour >= 12) prob *= 0.5 // Qua afternoon lighter
      grid[d][h] = ((seed * (di + 1) * (hi + 3)) % 100) / 100 < prob
    })
  })
  return grid
}

// ── Tab: Informações ──────────────────────────────────────
function TabInfo({ pr }) {
  return (
    <div>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:9.5,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:6}}>Formação</div>
        <div style={{fontSize:13,color:'#2e5f7a'}}>{pr.formacao || `${pr.esp} — ${pr.crm?.startsWith('CRM') ? 'USP' : 'UNICAMP'}`}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
        {[
          { label:'Especialidade', value: pr.esp },
          { label:'Registro', value: pr.crm || '—' },
          { label:'Sala Principal', value: pr.sala || '—' },
        ].map(({label, value}) => (
          <div key={label} style={{background:'#f5f8fa',borderRadius:10,padding:'12px 14px',border:'1px solid #e8f0f5'}}>
            <div style={{fontSize:9,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:4}}>{label}</div>
            <div style={{fontSize:13,fontWeight:600,color:'#2e5f7a'}}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Agenda & Disponibilidade ─────────────────────────
function getWeekDays() {
  const today = new Date()
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  const labels = ['Seg','Ter','Qua','Qui','Sex']
  return labels.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      label,
      date: d.toISOString().slice(0,10),
      display: `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`,
      isToday: d.toDateString() === today.toDateString(),
    }
  })
}

function TabAgenda({ pr, appointments }) {
  const schedule = buildSchedule(pr.nome)
  const weekDays = getWeekDays()

  // Map appointments by "date_time"
  const apptMap = {}
  appointments.forEach(a => { apptMap[`${a.date}_${a.time}`] = a })

  // Only show hours that are available on at least one day
  const activeHours = HOURS.filter(h => DAYS.some(d => schedule[d][h]))

  const todayStr = new Date().toISOString().slice(0,10)

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:700,color:'#2e5f7a'}}>Agenda da Semana — {pr.nome}</div>
        <div style={{display:'flex',gap:16,fontSize:11,color:'#9aaebb',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <div style={{width:12,height:12,borderRadius:3,background:'#cce9f5',border:'1px solid #a8d8ee'}}/>
            Agendado
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <div style={{width:12,height:12,borderRadius:3,background:'#e8f9f0',border:'1px solid #a8dcc0'}}/>
            Livre
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <div style={{width:12,height:12,borderRadius:3,background:'#f5f8fa',border:'1px solid #e2eaef'}}/>
            Bloqueado
          </div>
        </div>
      </div>

      <div style={{overflowX:'auto'}}>
        <table style={{borderCollapse:'separate',borderSpacing:'4px 3px',fontSize:11.5,width:'100%',minWidth:600}}>
          <thead>
            <tr>
              <th style={{width:48,paddingBottom:6}}/>
              {weekDays.map(wd => (
                <th key={wd.date} style={{
                  textAlign:'center',fontWeight:700,fontSize:11,paddingBottom:6,minWidth:110,
                  color: wd.isToday ? '#2e9ac4' : '#587080',
                }}>
                  {wd.label}
                  <span style={{display:'block',fontSize:9.5,fontWeight:400,color: wd.isToday?'#2e9ac4':'#9aaebb'}}>
                    {wd.display}{wd.isToday ? ' · hoje' : ''}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeHours.map(h => (
              <tr key={h}>
                <td style={{fontSize:10,color:'#bfcdd8',fontWeight:600,paddingRight:6,textAlign:'right',whiteSpace:'nowrap',verticalAlign:'middle'}}>
                  {h}
                </td>
                {weekDays.map(wd => {
                  const avail = schedule[wd.label]?.[h]
                  const appt  = apptMap[`${wd.date}_${h}`]
                  const isPast = wd.date < todayStr

                  if (!avail) return (
                    <td key={wd.date}>
                      <div style={{height:34,borderRadius:7,background:'transparent'}}/>
                    </td>
                  )

                  if (appt) return (
                    <td key={wd.date}>
                      <div style={{
                        height:34,borderRadius:7,padding:'0 8px',
                        background:'#cce9f5',border:'1px solid #a8d8ee',
                        display:'flex',flexDirection:'column',justifyContent:'center',
                      }}>
                        <div style={{fontSize:10,fontWeight:700,color:'#2e5f7a',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                          {appt.pacNome}
                        </div>
                        <div style={{fontSize:8.5,color:'#7a90a0'}}>
                          {appt.status==='confirmed'?'Confirmado':'Pendente'}
                        </div>
                      </div>
                    </td>
                  )

                  return (
                    <td key={wd.date}>
                      <div style={{
                        height:34,borderRadius:7,padding:'0 8px',
                        background: isPast ? '#f5f8fa' : '#e8f9f0',
                        border: `1px solid ${isPast ? '#e2eaef' : '#a8dcc0'}`,
                        display:'flex',alignItems:'center',
                      }}>
                        <span style={{fontSize:10,fontWeight:600,color: isPast?'#bfcdd8':'#2e8c6e'}}>
                          {isPast ? '—' : 'Livre'}
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Tab: Pacientes ────────────────────────────────────────
function TabPacientes({ patients, onSelectPatient }) {
  if (!patients.length) return <div style={{color:'#bfcdd8',textAlign:'center',padding:32}}>Nenhum paciente vinculado</div>

  return (
    <div>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
        <thead>
          <tr style={{fontSize:9.5,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.6px'}}>
            <th style={{textAlign:'left',padding:'6px 8px',fontWeight:700}}>Paciente</th>
            <th style={{textAlign:'left',padding:'6px 8px',fontWeight:700}}>Plano</th>
            <th style={{textAlign:'left',padding:'6px 8px',fontWeight:700}}>Freq. Real</th>
            <th style={{textAlign:'left',padding:'6px 8px',fontWeight:700}}>Últ. Consulta</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id} style={{borderTop:'1px solid #f0f5f8',cursor:'pointer'}}
              onClick={() => onSelectPatient(p)}
              onMouseEnter={e => e.currentTarget.style.background='#f5f8fa'}
              onMouseLeave={e => e.currentTarget.style.background=''}
            >
              <td style={{padding:'10px 8px'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{
                    width:34,height:34,borderRadius:'50%',background:'#cce9f5',color:'#2e5f7a',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:11,fontWeight:700,flexShrink:0,
                  }}>{initials(p.nome)}</div>
                  <div>
                    <div style={{fontWeight:600,color:'#1a6fa8',textDecoration:'underline dotted'}}>{p.nome}</div>
                    <div style={{fontSize:10.5,color:'#9aaebb'}}>{p.esp}</div>
                  </div>
                </div>
              </td>
              <td style={{padding:'10px 8px'}}>
                <Badge $variant={PLANO_BADGE[p.plano]||'gray'}>{p.plano}</Badge>
              </td>
              <td style={{padding:'10px 8px'}}>
                <Badge $variant="sky">{p.freqPresc || 'Semanal'}</Badge>
              </td>
              <td style={{padding:'10px 8px',color:'#587080'}}>{fmtDate(p.lastVisit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Tab: Desempenho ───────────────────────────────────────
function TabDesempenho({ patients }) {
  const total = patients.length
  const alta = patients.filter(p => p.freqPresc === '2x/semana').length
  const quinzenal = patients.filter(p => p.freqPresc === 'Quinzenal').length
  const baixa = patients.filter(p => p.freqPresc === 'Mensal' || !p.freqPresc).length

  const consultas = patients.reduce((s, p) => s + (p.visitCount || 0), 0)
  const media = total ? (consultas / total).toFixed(1) : '—'
  const ativos = patients.filter(p => p.freqPresc !== 'Mensal').length
  const taxaAtiva = total ? Math.round((ativos / total) * 100) + '%' : '—'

  const bars = [
    { label:'Alta (2x/semana)', count: alta, color:'#2e9ac4' },
    { label:'Quinzenal', count: quinzenal, color:'#c8821a' },
    { label:'Baixa / Irregular', count: baixa, color:'#e05858' },
  ]
  const maxBar = Math.max(...bars.map(b => b.count), 1)

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}>
      <div>
        <div style={{fontSize:9.5,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:14}}>Frequência dos Pacientes</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {bars.map(b => (
            <div key={b.label} style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:120,fontSize:11.5,color:'#587080',flexShrink:0}}>{b.label}</div>
              <div style={{flex:1,height:16,background:'#f0f5f8',borderRadius:4,overflow:'hidden'}}>
                <div style={{width:`${(b.count/maxBar)*100}%`,height:'100%',background:b.color,borderRadius:4,minWidth: b.count > 0 ? 16 : 0}}/>
              </div>
              <div style={{fontSize:12,fontWeight:700,color:b.color,width:14,textAlign:'right'}}>{b.count}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,alignContent:'start'}}>
        {[
          { label:'Pacientes', value: total },
          { label:'Consultas/mês', value: consultas },
          { label:'Média/pac.', value: media },
          { label:'Taxa Ativa (≥Quinz.)', value: taxaAtiva },
        ].map(({label,value}) => (
          <div key={label} style={{background:'#f5f8fa',borderRadius:10,padding:'12px 14px',border:'1px solid #e8f0f5'}}>
            <div style={{fontSize:9,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:4}}>{label}</div>
            <div style={{fontSize:18,fontWeight:700,color:'#2e5f7a'}}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────
const TABS = [
  { key:'info',     label:'Informações' },
  { key:'agenda',   label:'Agenda & Disponibilidade' },
  { key:'pacientes',label:'Pacientes' },
  { key:'desempenho',label:'Desempenho' },
]

export default function ProfessionalProfile({ prof, onClose }) {
  const [tab, setTab] = useState('info')
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)

  useEffect(() => {
    getPatients({ prof: prof.nome }).then(setPatients).catch(() => {})
    getAppointments({}).then(all => {
      setAppointments(all.filter(a => a.profNome === prof.nome || a.prof === prof.nome))
    }).catch(() => {})
  }, [prof.nome])

  // Derived stats
  const totalPac = patients.length
  const consultas = patients.reduce((s, p) => s + (p.visitCount || 0), 0)
  const media = totalPac ? (consultas / totalPac).toFixed(1) : '—'

  // Vagas livres esta semana
  const schedule = buildSchedule(prof.nome)
  const weekDays = getWeekDays()
  const apptKeys = new Set(appointments.map(a => `${a.date}_${a.time}`))
  const todayStr = new Date().toISOString().slice(0,10)
  let freeSlots = 0
  weekDays.forEach(wd => {
    if (wd.date < todayStr) return
    HOURS.forEach(h => {
      if (schedule[wd.label]?.[h] && !apptKeys.has(`${wd.date}_${h}`)) freeSlots++
    })
  })

  return (
    <Overlay>
      <Topbar>
        <BackBtn onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar para Profissionais
        </BackBtn>
        <span style={{fontSize:14,fontWeight:700,color:'#2e5f7a'}}>{prof.nome}</span>
        <div style={{width:140}}/>
      </Topbar>

      <Body>
        {/* Hero */}
        <Hero>
          <Av>{initials(prof.nome)}</Av>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:20,fontWeight:800,color:'#2e5f7a',marginBottom:4}}>{prof.nome}</div>
            <Badge $variant={ESP_BADGE[prof.esp]||'gray'} style={{marginBottom:6}}>{prof.esp}</Badge>
            <div style={{fontSize:12,color:'#9aaebb',marginBottom:6}}>
              {prof.crm || '—'}{prof.sala ? ` · Sala: ${prof.sala}` : ''}
            </div>
            <div style={{fontSize:12.5,color:'#587080',lineHeight:1.6,maxWidth:460}}>{prof.bio}</div>
          </div>
          <StatGrid>
            {[
              { value: totalPac,   label:'Pacientes' },
              { value: consultas,  label:'Consultas/mês' },
              { value: media,      label:'Média/pac.' },
              { value: freeSlots,  label:'Vagas livres' },
            ].map(({value,label}) => (
              <StatBox key={label}>
                <div style={{fontSize:22,fontWeight:800,color: label==='Pacientes'?'#2e9ac4':'#2e5f7a'}}>{value}</div>
                <div style={{fontSize:10.5,color:'#9aaebb',marginTop:2}}>{label}</div>
              </StatBox>
            ))}
          </StatGrid>
        </Hero>

        {/* Tabs */}
        <TabBar>
          {TABS.map(t => (
            <Tab key={t.key} $active={tab===t.key} onClick={()=>setTab(t.key)}>{t.label}</Tab>
          ))}
        </TabBar>
        <TabBody>
          {tab === 'info'       && <TabInfo pr={prof}/>}
          {tab === 'agenda'     && <TabAgenda pr={prof} appointments={appointments}/>}
          {tab === 'pacientes'  && <TabPacientes patients={patients} onSelectPatient={setSelectedPatient}/>}
          {tab === 'desempenho' && <TabDesempenho patients={patients}/>}
        </TabBody>
      </Body>

      {selectedPatient && (
        <PatientProfile
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onEdit={() => setSelectedPatient(null)}
        />
      )}
    </Overlay>
  )
}
