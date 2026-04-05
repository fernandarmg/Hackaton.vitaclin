import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { getAppointments, confirmAppointment, deleteAppointment, getProfessionals } from '../services/api'
import { PageHeader, PageTitle, PageSub, PrimaryButton, Badge } from '../components/ui'

// ── Styled ───────────────────────────────────────────────
const CalWrap = styled.div`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.g200};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(46,95,122,.07);
`
const CalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid ${({ theme }) => theme.colors.g100};
`
const NavBtn = styled.button`
  width: 30px; height: 30px; border-radius: 50%; border: 1px solid ${({ theme }) => theme.colors.g200};
  background: #fff; cursor: pointer; font-size: 14px; display: flex; align-items: center;
  justify-content: center; transition: all .15s;
  &:hover { background: ${({ theme }) => theme.colors.g50}; }
`
const MonthTitle = styled.span`
  font-size: 15px; font-weight: 700; color: ${({ theme }) => theme.colors.g900};
`
const TodayBtn = styled.button`
  padding: 4px 12px; border-radius: 6px; border: 1px solid ${({ theme }) => theme.colors.g300};
  background: #fff; font-size: 12px; font-weight: 600; color: ${({ theme }) => theme.colors.g700};
  cursor: pointer; transition: all .15s;
  &:hover { background: ${({ theme }) => theme.colors.g50}; }
`
const Legend = styled.div`
  display: flex; gap: 12px; align-items: center;
`
const LegDot = styled.span`
  display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: #587080;
  &::before { content:''; display:inline-block; width:10px; height:10px; border-radius:3px;
    background: ${({ $color }) => $color}; }
`
const ProfSelect = styled.select`
  padding: 5px 10px; border: 1px solid ${({ theme }) => theme.colors.g300};
  border-radius: 8px; font-size: 12.5px; font-family: inherit;
  background: #fff; color: ${({ theme }) => theme.colors.g800};
  cursor: pointer; outline: none;
`
const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`
const DayHeader = styled.div`
  padding: 8px 0; text-align: center;
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  color: ${({ theme }) => theme.colors.g500};
  background: ${({ theme }) => theme.colors.g50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.g100};
`
const DayCell = styled.div`
  min-height: 90px; padding: 6px; border-right: 1px solid ${({ theme }) => theme.colors.g100};
  border-bottom: 1px solid ${({ theme }) => theme.colors.g100};
  background: ${({ $today, $otherMonth }) => $today ? '#f0f9ff' : $otherMonth ? '#fafbfc' : '#fff'};
  cursor: pointer; transition: background .12s;
  &:nth-child(7n) { border-right: none; }
  &:hover { background: ${({ $today }) => $today ? '#e6f6ff' : '#f5f8fa'}; }
`
const DayNum = styled.div`
  font-size: 12px; font-weight: ${({ $today }) => $today ? 700 : 500};
  color: ${({ $today, $otherMonth, theme }) =>
    $today ? theme.colors.b2 : $otherMonth ? theme.colors.g300 : theme.colors.g800};
  width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; margin-bottom: 3px;
  background: ${({ $today }) => $today ? '#2e9ac4' : 'transparent'};
  color: ${({ $today }) => $today ? '#fff' : undefined};
`
const ApptChip = styled.div`
  font-size: 10.5px; font-weight: 600; border-radius: 4px; padding: 1px 5px;
  margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  background: ${({ $color }) => $color + '22'};
  color: ${({ $color }) => $color};
  border-left: 3px solid ${({ $color }) => $color};
  cursor: pointer;
`
const MoreTag = styled.div`
  font-size: 10px; color: ${({ theme }) => theme.colors.g400}; padding: 1px 4px;
`

// Detail panel
const Panel = styled.div`
  background: #fff; border: 1px solid ${({ theme }) => theme.colors.g200};
  border-radius: 14px; padding: 20px; margin-top: 14px;
  box-shadow: 0 1px 4px rgba(46,95,122,.07);
`
const PanelTitle = styled.div`
  font-size: 14px; font-weight: 700; color: ${({ theme }) => theme.colors.g900};
  margin-bottom: 14px;
`
const ApptRow = styled.div`
  display: flex; align-items: center; gap: 12px; padding: 10px 14px;
  border-radius: 8px; border: 1px solid ${({ theme }) => theme.colors.g100};
  margin-bottom: 8px; background: #fff; transition: all .15s;
  &:hover { border-color: ${({ theme }) => theme.colors.g300}; background: ${({ theme }) => theme.colors.g50}; }
`
const TimeTag = styled.span`
  font-size: 12px; font-weight: 700; color: ${({ theme }) => theme.colors.g600}; min-width: 42px;
`
const Dot = styled.div`
  width: 9px; height: 9px; border-radius: 50%; background: ${({ $color }) => $color}; flex-shrink: 0;
`
const ActionBtn = styled.button`
  padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
  border: none; cursor: pointer; transition: all .15s;
  background: ${({ $danger }) => $danger ? '#fdf1f1' : '#e8f5fa'};
  color: ${({ $danger }) => $danger ? '#c94f4f' : '#2e5f7a'};
  &:hover { background: ${({ $danger }) => $danger ? '#c94f4f' : '#2e9ac4'}; color: #fff; }
`

const ESP_COLOR    = { Fisioterapia:'#2e9ac4', Nutrição:'#c8821a', Psicologia:'#2e5f7a' }
const ESP_COLOR_BG = { Fisioterapia:'#cce9f5', Nutrição:'#fde8c2', Psicologia:'#d0e2ec' }
const DAYS_PT   = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB']
const WEEK_DAYS = ['Seg','Ter','Qua','Qui','Sex']
const WEEK_DATES= ['2026-04-07','2026-04-08','2026-04-09','2026-04-10','2026-04-11']
const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

// ── Week slot grid styled ────────────────────────────────
const SlotWrap = styled.div`
  background:#fff; border:1px solid ${({theme})=>theme.colors.g200};
  border-radius:14px; overflow:hidden; margin-top:14px;
  box-shadow:0 1px 4px rgba(46,95,122,.07);
`
const SlotHeader = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 20px; border-bottom:1px solid ${({theme})=>theme.colors.g100};
`
const SlotTable = styled.div`overflow-x:auto;`
const SlotGrid = styled.div`
  display:grid;
  grid-template-columns: 140px repeat(5, 1fr);
  min-width:700px;
`
const SlotDayHead = styled.div`
  padding:8px 10px; text-align:center; font-size:11px; font-weight:700;
  text-transform:uppercase; color:${({theme})=>theme.colors.g500};
  background:${({theme})=>theme.colors.g50};
  border-bottom:1px solid ${({theme})=>theme.colors.g100};
  border-right:1px solid ${({theme})=>theme.colors.g100};
`
const SlotProfCell = styled.div`
  padding:10px 14px; border-bottom:1px solid ${({theme})=>theme.colors.g100};
  border-right:1px solid ${({theme})=>theme.colors.g100};
  background:#fafbfc;
`
const SlotDayCell = styled.div`
  padding:8px; border-bottom:1px solid ${({theme})=>theme.colors.g100};
  border-right:1px solid ${({theme})=>theme.colors.g100};
  display:flex; flex-wrap:wrap; gap:4px; align-content:flex-start;
`
const TimeChip = styled.div`
  padding:3px 7px; border-radius:6px; font-size:10.5px; font-weight:700;
  cursor:pointer; transition:all .12s; white-space:nowrap;
  background:${({$type,esp})=>
    $type==='free'    ? '#f59e0b' :
    $type==='pending' ? 'transparent' :
    ESP_COLOR_BG[esp]||'#e0eef5'};
  color:${({$type,esp})=>
    $type==='free'    ? '#fff' :
    $type==='pending' ? '#c8821a' :
    ESP_COLOR[esp]||'#2e5f7a'};
  border:${({$type})=>$type==='pending' ? '1.5px dashed #c8821a' : '1.5px solid transparent'};
  &:hover { opacity:.82; }
`
const SlotLegend = styled.div`
  display:flex; gap:14px; align-items:center; flex-wrap:wrap;
  padding:10px 20px; border-top:1px solid ${({theme})=>theme.colors.g100};
  font-size:11px; color:#587080;
`
const LegItem = styled.span`
  display:inline-flex; align-items:center; gap:5px;
  &::before { content:''; display:inline-block; width:12px; height:12px; border-radius:3px;
    background:${({$bg})=>$bg||'#eee'};
    border:${({$border})=>$border||'1.5px solid transparent'}; }
`

export default function AgendaPage() {
  const { isProfissional, profNome } = useAuth()
  const [appts,       setAppts]       = useState([])
  const [professionals,setProfessionals]= useState([])
  const [loading,     setLoading]     = useState(true)
  const [curDate,     setCurDate]     = useState(new Date('2026-04-04'))
  const [selectedDay, setSelectedDay] = useState('2026-04-08')
  const [filterProf,  setFilterProf]  = useState('Todos')

  const load = async () => {
    setLoading(true)
    try {
      const params = isProfissional ? { prof: profNome } : {}
      const [a, profs] = await Promise.all([getAppointments(params), getProfessionals()])
      setAppts(a)
      setProfessionals(profs)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleConfirm = async (id) => { await confirmAppointment(id); load() }
  const handleDelete  = async (id) => { await deleteAppointment(id);  load() }

  // ── Calendar helpers ─────────────────────────────────────
  const year  = curDate.getFullYear()
  const month = curDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const today = '2026-04-04'

  const toKey = (y, m, d) =>
    `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

  const filteredAppts = filterProf === 'Todos' ? appts : appts.filter(a => a.prof === filterProf)

  const apptsByDay = filteredAppts.reduce((acc, a) => {
    if (!acc[a.date]) acc[a.date] = []
    acc[a.date].push(a)
    return acc
  }, {})

  // Build calendar cells
  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevDays - firstDay + 1 + i, thisMonth: false,
      key: toKey(month === 0 ? year-1 : year, month === 0 ? 11 : month-1, prevDays - firstDay + 1 + i) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, thisMonth: true, key: toKey(year, month, d) })
  }
  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, thisMonth: false,
      key: toKey(month === 11 ? year+1 : year, month === 11 ? 0 : month+1, next-1) })
  }

  const prevMonth = () => setCurDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurDate(new Date(year, month + 1, 1))

  const selectedAppts = (apptsByDay[selectedDay] || []).sort((a,b) => a.time.localeCompare(b.time))

  // ── Week slot grid ───────────────────────────────────────
  // For each prof × weekday, list all schedule slots and mark booked ones
  const weekApptMap = {} // key: "profNome|date|time" => appt
  appts.forEach(a => { weekApptMap[`${a.prof}|${a.date}|${a.time}`] = a })

  const totalFreeWeek = professionals.reduce((total, prof) => {
    const esp = prof.esp
    return total + WEEK_DATES.reduce((s, date, di) => {
      const dayKey = WEEK_DAYS[di]
      const slots  = prof.schedule?.[dayKey] || []
      return s + slots.filter(t => !weekApptMap[`${prof.nome}|${date}|${t}`]).length
    }, 0)
  }, 0)

  const fmtSelectedDay = () => {
    if (!selectedDay) return ''
    const [y,m,d] = selectedDay.split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>{isProfissional ? 'Minha Agenda' : 'Agenda'}</PageTitle>
          <PageSub>Visualização mensal · Filtrar por profissional</PageSub>
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          {!isProfissional && (
            <ProfSelect value={filterProf} onChange={e => setFilterProf(e.target.value)}>
              <option value="Todos">Todos os profissionais</option>
              {professionals.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
            </ProfSelect>
          )}
          <PrimaryButton>+ Nova consulta</PrimaryButton>
        </div>
      </PageHeader>

      {loading ? <p style={{color:'#9aaebb',padding:32}}>Carregando…</p> : (
        <>
          <CalWrap>
            {/* Header */}
            <CalHeader>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <NavBtn onClick={prevMonth}>‹</NavBtn>
                <MonthTitle>{MONTHS_PT[month]} {year}</MonthTitle>
                <NavBtn onClick={nextMonth}>›</NavBtn>
                <TodayBtn onClick={() => { setCurDate(new Date('2026-04-04')); setSelectedDay('2026-04-04') }}>Hoje</TodayBtn>
              </div>
              <Legend>
                <LegDot $color="#2e9ac4">Fisioterapia</LegDot>
                <LegDot $color="#c8821a">Nutrição</LegDot>
                <LegDot $color="#2e5f7a">Psicologia</LegDot>
              </Legend>
            </CalHeader>

            {/* Day headers */}
            <WeekGrid>
              {DAYS_PT.map(d => <DayHeader key={d}>{d}</DayHeader>)}
            </WeekGrid>

            {/* Cells */}
            <WeekGrid>
              {cells.map((cell, i) => {
                const dayAppts = (apptsByDay[cell.key] || []).slice(0, 3)
                const extra = (apptsByDay[cell.key] || []).length - 3
                const isToday = cell.key === today
                const isSelected = cell.key === selectedDay
                return (
                  <DayCell key={i} $today={isToday} $otherMonth={!cell.thisMonth}
                    onClick={() => setSelectedDay(cell.key)}
                    style={isSelected ? { outline:'2px solid #2e9ac4', outlineOffset:'-2px' } : {}}>
                    <DayNum $today={isToday} $otherMonth={!cell.thisMonth}>{cell.day}</DayNum>
                    {dayAppts.map(a => {
                      const color = ESP_COLOR[a.obs === 'Sessão' ? 'Psicologia' :
                        a.sala?.includes('Nutrição') ? 'Nutrição' :
                        a.sala?.includes('Psicologia') ? 'Psicologia' : 'Fisioterapia']
                      return (
                        <ApptChip key={a.id} $color={color}>
                          {a.time} {(a.pacNome||'').split(' ')[0]}
                          {a.status === 'pending' && ' ⚠'}
                        </ApptChip>
                      )
                    })}
                    {extra > 0 && <MoreTag>+{extra} mais</MoreTag>}
                  </DayCell>
                )
              })}
            </WeekGrid>
          </CalWrap>

          {/* Detail panel */}
          {/* ── Week slot grid ── */}
          <SlotWrap>
            <SlotHeader>
              <div>
                <div style={{fontWeight:700, fontSize:14, color:'#2e5f7a'}}>Vagas disponíveis — semana atual</div>
                <div style={{fontSize:11, color:'#9aaebb', marginTop:2}}>Verde = livre para agendamento · Clique para agendar</div>
              </div>
              <div style={{display:'flex', gap:10, alignItems:'center'}}>
                {!isProfissional && (
                  <ProfSelect value={filterProf} onChange={e => setFilterProf(e.target.value)}>
                    <option value="Todos">Todos os profissionais</option>
                    {professionals.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
                  </ProfSelect>
                )}
              </div>
            </SlotHeader>
            <SlotTable>
              <SlotGrid>
                {/* Header row */}
                <SlotDayHead style={{textAlign:'left', paddingLeft:14}}>Profissional</SlotDayHead>
                {WEEK_DAYS.map((d,i) => (
                  <SlotDayHead key={d}>
                    {d}<br/>
                    <span style={{fontWeight:400, fontSize:10, color:'#bfcdd8'}}>
                      {WEEK_DATES[i].slice(8)}/04
                    </span>
                  </SlotDayHead>
                ))}

                {/* Prof rows */}
                {(filterProf === 'Todos' ? professionals : professionals.filter(p => p.nome === filterProf))
                  .map(prof => (
                  <React.Fragment key={prof.id}>
                    <SlotProfCell>
                      <div style={{fontWeight:700, fontSize:12.5, color:'#2e5f7a'}}>
                        {prof.nome.replace('Dr. ','Dr. ').replace('Dra. ','').split(' ')[0]}
                        {' '}{prof.nome.split(' ').slice(-1)[0]}
                      </div>
                      <div style={{fontSize:11, color: ESP_COLOR[prof.esp]||'#9aaebb'}}>{prof.esp}</div>
                    </SlotProfCell>
                    {WEEK_DATES.map((date, di) => {
                      const dayKey = WEEK_DAYS[di]
                      const slots  = prof.schedule?.[dayKey] || []
                      return (
                        <SlotDayCell key={date}>
                          {slots.map(time => {
                            const appt = weekApptMap[`${prof.nome}|${date}|${time}`]
                            const type = !appt ? 'free' : appt.status === 'pending' ? 'pending' : 'booked'
                            return (
                              <TimeChip key={time} $type={type} esp={prof.esp}
                                title={appt ? `${appt.pacNome}` : `Livre: ${time}`}>
                                {time}
                              </TimeChip>
                            )
                          })}
                          {slots.length === 0 && (
                            <span style={{fontSize:10, color:'#d1dde6'}}>—</span>
                          )}
                        </SlotDayCell>
                      )
                    })}
                  </React.Fragment>
                ))}
              </SlotGrid>
            </SlotTable>
            <SlotLegend>
              <LegItem $bg="#f59e0b">Livre</LegItem>
              <LegItem $bg={ESP_COLOR_BG.Fisioterapia}>Fisioterapia</LegItem>
              <LegItem $bg={ESP_COLOR_BG.Nutrição}>Nutrição</LegItem>
              <LegItem $bg={ESP_COLOR_BG.Psicologia}>Psicologia</LegItem>
              <LegItem $bg="transparent" $border="1.5px dashed #c8821a">Pendente</LegItem>
              <LegItem $bg="#f0f5f8">Indisponível</LegItem>
              <span style={{marginLeft:'auto', fontWeight:700, color:'#2e9ac4', fontSize:12}}>
                {totalFreeWeek} vagas livres esta semana
              </span>
            </SlotLegend>
          </SlotWrap>

          {selectedDay && (
            <Panel>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14}}>
                <PanelTitle>Consultas — {fmtSelectedDay()}</PanelTitle>
                <button onClick={() => setSelectedDay(null)}
                  style={{border:'none', background:'none', fontSize:18, color:'#9aaebb', cursor:'pointer'}}>×</button>
              </div>
              {selectedAppts.length === 0
                ? <p style={{color:'#bfcdd8', textAlign:'center', padding:'20px 0', fontSize:13}}>
                    Nenhum agendamento neste dia.
                  </p>
                : selectedAppts.map(a => {
                    const esp = a.sala?.includes('Nutrição') ? 'Nutrição' :
                      a.sala?.includes('Psicologia') ? 'Psicologia' : 'Fisioterapia'
                    const color = ESP_COLOR[esp]
                    return (
                      <ApptRow key={a.id}>
                        <TimeTag>{a.time}</TimeTag>
                        <Dot $color={color}/>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13, fontWeight:600}}>{a.pacNome||'—'}</div>
                          <div style={{fontSize:11, color:'#7a90a0'}}>{esp} · {a.prof} · {a.sala}</div>
                        </div>
                        <Badge $variant={a.status==='confirmed' ? 'teal' : 'amber'}>
                          {a.status==='confirmed' ? 'Confirmado' : 'Pend.'}
                        </Badge>
                        {a.status === 'pending' && (
                          <ActionBtn onClick={() => handleConfirm(a.id)}>✓</ActionBtn>
                        )}
                        <ActionBtn $danger onClick={() => handleDelete(a.id)}>✕</ActionBtn>
                      </ApptRow>
                    )
                  })
              }
            </Panel>
          )}
        </>
      )}
    </div>
  )
}
