import { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { getFinances, createFinance, getPatients, getProfessionals } from '../services/api'
import {
  PageHeader, PageTitle, PageSub, PrimaryButton, Button,
  Badge, FormGroup, FormLabel, FormInput, FormSelect,
} from '../components/ui'

// ── Helpers ───────────────────────────────────────────────
const fmt  = v => `R$ ${Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:0})}`
const fmtDate = d => !d?'—':d.split('-').reverse().join('/')
const ini  = n => n?.trim().split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?'

const ESP_COLORS = { Fisioterapia:'#2e9ac4', Nutrição:'#3a7a9c', Psicologia:'#2e5f7a', Outros:'#c8821a' }
const PROF_COLOR = {
  'Dra. Camila Torres':'#2e9ac4','Dr. Rafael Nunes':'#3a7a9c',
  'Dra. Beatriz Lemos':'#2e5f7a','Dr. André Melo':'#7abcd8',
}
const PLANO_COLOR = { Fidelidade:'#2e5f7a', Premium:'#c8821a', Básico:'#2e9ac4', Avulso:'#9aaebb' }
const FORMA_COLORS = ['#2e9ac4','#3a7a9c','#2e5f7a','#c8821a','#c94f4f','#9aaebb']
const PLANO_BADGE = { Premium:'amber', Fidelidade:'sky', Básico:'navy', Avulso:'gray' }
const STATUS_BADGE = { Pago:'teal', Pendente:'amber', Cancelado:'red' }

function classEsp(svc) {
  if (['Fisioterapia','Terapia Manual','Acupuntura','Avaliação Inicial','Pilates Clínico',
       'Ultrassom Terapêutico','TENS / Eletroestimulação','Liberação Miofascial',
       'Terapia Manual Articular','Dry Needling','RPG — Reeducação Postural',
       'Fisioterapia Esportiva','Recovery Compressivo','Crioterapia Localizada'].includes(svc))
    return 'Fisioterapia'
  if (['Nutrição','Bioimpedância','Orientação em Grupo','Bioimpedância Vetorial',
       'Nutrição Esportiva','Nutrição Clínica Funcional','Plano Alimentar Detalhado',
       'Monitoramento por Aplicativo','Workshop Culinária Saudável'].includes(svc))
    return 'Nutrição'
  if (['Psicologia','Psicoeducação','Treino de Habilidades (DBT)','Mindfulness Clínico',
       'Avaliação Neuropsicológica','Grupo Terapêutico','Sessão de Crise'].includes(svc))
    return 'Psicologia'
  return 'Outros'
}

// ── Mock data (always shown if API empty) ─────────────────
const MOCK = [
  {id:1,  pacNome:'Ana Beatriz Ferreira', svc:'Fisioterapia',       prof:'Dra. Camila Torres', plano:'Premium',    valor:180, status:'Pago',     forma:'Pix',               data:'2026-04-02'},
  {id:2,  pacNome:'Carlos Eduardo Lima',  svc:'Nutrição',           prof:'Dr. Rafael Nunes',   plano:'Fidelidade', valor:150, status:'Pago',     forma:'Cartão de crédito', data:'2026-04-02'},
  {id:3,  pacNome:'Fernanda Costa Alves', svc:'Psicologia',         prof:'Dra. Beatriz Lemos', plano:'Premium',    valor:200, status:'Pago',     forma:'Pix',               data:'2026-04-01'},
  {id:4,  pacNome:'Roberto Mendonça',     svc:'Fisioterapia',       prof:'Dra. Camila Torres', plano:'Básico',     valor:180, status:'Pendente', forma:'—',                 data:'2026-04-08'},
  {id:5,  pacNome:'Juliana Martins',      svc:'Nutrição',           prof:'Dr. Rafael Nunes',   plano:'Premium',    valor:150, status:'Pago',     forma:'Pix',               data:'2026-04-01'},
  {id:6,  pacNome:'Marcelo Souza',        svc:'Psicologia',         prof:'Dra. Beatriz Lemos', plano:'Premium',    valor:200, status:'Pago',     forma:'Pix',               data:'2026-04-01'},
  {id:7,  pacNome:'Patrícia Almeida',     svc:'Fisioterapia',       prof:'Dra. Camila Torres', plano:'Fidelidade', valor:180, status:'Pago',     forma:'Cartão de débito',  data:'2026-04-02'},
  {id:8,  pacNome:'Gabriel Teixeira',     svc:'Nutrição Esportiva', prof:'Dr. Rafael Nunes',   plano:'Fidelidade', valor:190, status:'Pago',     forma:'Pix',               data:'2026-04-02'},
  {id:9,  pacNome:'Thiago Nascimento',    svc:'Psicologia',         prof:'Dra. Beatriz Lemos', plano:'Fidelidade', valor:200, status:'Pago',     forma:'Transferência',     data:'2026-04-01'},
  {id:10, pacNome:'Isabela Rodrigues',    svc:'Fisioterapia',       prof:'Dra. Camila Torres', plano:'Fidelidade', valor:180, status:'Pago',     forma:'Pix',               data:'2026-04-02'},
  {id:11, pacNome:'Diego Barbosa',        svc:'Terapia Manual',     prof:'Dra. Camila Torres', plano:'Premium',    valor:165, status:'Pago',     forma:'Cartão de crédito', data:'2026-04-01'},
  {id:12, pacNome:'Felipe Cunha',         svc:'Psicologia',         prof:'Dra. Beatriz Lemos', plano:'Premium',    valor:200, status:'Pago',     forma:'Pix',               data:'2026-04-01'},
  {id:13, pacNome:'Bruno Cavalcanti',     svc:'Fisioterapia',       prof:'Dr. André Melo',     plano:'Fidelidade', valor:180, status:'Pendente', forma:'—',                 data:'2026-04-10'},
  {id:14, pacNome:'Ana Beatriz Ferreira', svc:'Fisioterapia',       prof:'Dra. Camila Torres', plano:'Premium',    valor:180, status:'Pago',     forma:'Pix',               data:'2026-03-28'},
  {id:15, pacNome:'Carlos Eduardo Lima',  svc:'Bioimpedância',      prof:'Dr. Rafael Nunes',   plano:'Fidelidade', valor:100, status:'Pago',     forma:'Pix',               data:'2026-03-25'},
  {id:16, pacNome:'Fernanda Costa Alves', svc:'Psicologia',         prof:'Dra. Beatriz Lemos', plano:'Premium',    valor:200, status:'Pago',     forma:'Cartão de crédito', data:'2026-03-22'},
  {id:17, pacNome:'Patrícia Almeida',     svc:'Fisioterapia',       prof:'Dra. Camila Torres', plano:'Fidelidade', valor:180, status:'Pago',     forma:'Pix',               data:'2026-03-18'},
  {id:18, pacNome:'Gabriel Teixeira',     svc:'Nutrição',           prof:'Dr. Rafael Nunes',   plano:'Fidelidade', valor:150, status:'Pago',     forma:'Pix',               data:'2026-03-15'},
  {id:19, pacNome:'Marcelo Souza',        svc:'Psicologia',         prof:'Dra. Beatriz Lemos', plano:'Premium',    valor:200, status:'Pago',     forma:'Transferência',     data:'2026-03-12'},
  {id:20, pacNome:'Bruno Cavalcanti',     svc:'Fisioterapia',       prof:'Dr. André Melo',     plano:'Fidelidade', valor:180, status:'Pago',     forma:'Pix',               data:'2026-03-10'},
  {id:21, pacNome:'Ana Beatriz Ferreira', svc:'Fisioterapia',       prof:'Dra. Camila Torres', plano:'Premium',    valor:180, status:'Pago',     forma:'Pix',               data:'2026-02-26'},
  {id:22, pacNome:'Juliana Martins',      svc:'Nutrição',           prof:'Dr. Rafael Nunes',   plano:'Premium',    valor:150, status:'Pago',     forma:'Cartão de crédito', data:'2026-02-20'},
  {id:23, pacNome:'Thiago Nascimento',    svc:'Psicologia',         prof:'Dra. Beatriz Lemos', plano:'Fidelidade', valor:200, status:'Pago',     forma:'Pix',               data:'2026-02-14'},
  {id:24, pacNome:'Isabela Rodrigues',    svc:'Fisioterapia',       prof:'Dra. Camila Torres', plano:'Fidelidade', valor:180, status:'Pago',     forma:'Pix',               data:'2026-02-10'},
  {id:25, pacNome:'Diego Barbosa',        svc:'Dry Needling',       prof:'Dra. Camila Torres', plano:'Premium',    valor:175, status:'Cancelado',forma:'—',                 data:'2026-02-05'},
  {id:26, pacNome:'Carlos Eduardo Lima',  svc:'Nutrição',           prof:'Dr. Rafael Nunes',   plano:'Fidelidade', valor:150, status:'Pago',     forma:'Pix',               data:'2026-01-28'},
  {id:27, pacNome:'Bruno Cavalcanti',     svc:'Fisioterapia',       prof:'Dr. André Melo',     plano:'Fidelidade', valor:180, status:'Pago',     forma:'Pix',               data:'2026-01-20'},
  {id:28, pacNome:'Fernanda Costa Alves', svc:'Psicologia',         prof:'Dra. Beatriz Lemos', plano:'Premium',    valor:200, status:'Pago',     forma:'Transferência',     data:'2026-01-15'},
  {id:29, pacNome:'Patrícia Almeida',     svc:'RPG — Reeducação Postural', prof:'Dra. Camila Torres', plano:'Fidelidade', valor:185, status:'Pago', forma:'Pix',           data:'2026-01-10'},
  {id:30, pacNome:'Gabriel Teixeira',     svc:'Bioimpedância Vetorial', prof:'Dr. Rafael Nunes', plano:'Fidelidade', valor:100, status:'Pago',   forma:'Pix',               data:'2026-01-08'},
  {id:31, pacNome:'Mariana Vaz',          svc:'Psicologia',         prof:'Dra. Beatriz Lemos', plano:'Básico',     valor:200, status:'Pendente', forma:'—',                 data:'2026-04-09'},
  {id:32, pacNome:'Lucas Ferreira',       svc:'Nutrição',           prof:'Dr. Rafael Nunes',   plano:'Básico',     valor:150, status:'Pendente', forma:'—',                 data:'2026-04-10'},
  {id:33, pacNome:'Letícia Prado',        svc:'Nutrição',           prof:'Dr. Rafael Nunes',   plano:'Básico',     valor:150, status:'Pendente', forma:'—',                 data:'2026-04-15'},
]

// ── Period filtering ──────────────────────────────────────
const PERIOD_BINS = {
  mes:  [{ label:'Sem 1', pfx:'2026-04-0' },{ label:'Sem 2', pfx:'2026-04-1' },{ label:'Sem 3', pfx:'2026-04-2' },{ label:'Sem 4', pfx:'2026-04-3' }],
  trim: [{ label:'Fev', pfx:'2026-02' },{ label:'Mar', pfx:'2026-03' },{ label:'Abr', pfx:'2026-04' }],
  sem:  [{ label:'Nov', pfx:'2025-11' },{ label:'Dez', pfx:'2025-12' },{ label:'Jan', pfx:'2026-01' },{ label:'Fev', pfx:'2026-02' },{ label:'Mar', pfx:'2026-03' },{ label:'Abr', pfx:'2026-04' }],
  ano:  [{ label:'Jan', pfx:'2026-01' },{ label:'Fev', pfx:'2026-02' },{ label:'Mar', pfx:'2026-03' },{ label:'Abr', pfx:'2026-04' }],
  tudo: [{ label:'Jan', pfx:'2026-01' },{ label:'Fev', pfx:'2026-02' },{ label:'Mar', pfx:'2026-03' },{ label:'Abr', pfx:'2026-04' }],
}
const PERIOD_LABEL = { mes:'Abril 2026', trim:'Últimos 3 meses', sem:'Últimos 6 meses', ano:'Ano de 2026', tudo:'Histórico completo' }

function filterByPeriod(items, period) {
  const now = new Date(), y = now.getFullYear(), m = now.getMonth()
  return items.filter(f => {
    const d = new Date(f.data)
    if (period === 'mes')  return d.getFullYear()===y && d.getMonth()===m
    if (period === 'trim') return d >= new Date(y, m-2, 1)
    if (period === 'sem')  return d >= new Date(y, m-5, 1)
    if (period === 'ano')  return d.getFullYear()===y
    return true
  })
}

// ── Styled ────────────────────────────────────────────────
const Card = styled.div`
  background:#fff; border:1px solid #e2eaef; border-radius:14px;
  padding:18px; box-shadow:0 1px 4px rgba(46,95,122,.06);
`
const KpiGrid = styled.div`
  display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px;
`
const KpiCard = styled(Card)`
  display:flex; align-items:center; gap:14px; padding:16px 18px;
`
const KpiIcon = styled.div`
  width:40px; height:40px; border-radius:10px; display:flex; align-items:center;
  justify-content:center; flex-shrink:0; background:${p=>p.$bg||'#e8f5fa'};
`
const PTabBar = styled.div`
  display:flex; gap:4px; background:#f0f5f8; border-radius:10px; padding:3px;
`
const PTab = styled.button`
  padding:5px 13px; border-radius:7px; border:none; font-size:12px; font-weight:500;
  cursor:pointer; transition:all .15s; font-family:inherit;
  background:${p=>p.$active?'#fff':'transparent'};
  color:${p=>p.$active?'#2e9ac4':'#7a90a0'};
  font-weight:${p=>p.$active?700:500};
  box-shadow:${p=>p.$active?'0 1px 4px rgba(0,0,0,.1)':'none'};
`
const Charts2 = styled.div`
  display:grid; grid-template-columns:1.3fr 1fr; gap:14px; margin-bottom:14px;
`
const Charts3 = styled.div`
  display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:14px;
`
const SectionLabel = styled.div`
  font-size:9.5px; font-weight:700; color:#9aaebb; text-transform:uppercase;
  letter-spacing:.7px; margin-bottom:12px;
`
const Modal = styled.div`
  position:fixed; inset:0; background:rgba(30,60,80,.42);
  backdrop-filter:blur(3px); display:flex; align-items:center;
  justify-content:center; z-index:1000;
`
const ModalCard = styled.div`
  background:#fff; border-radius:18px; padding:26px; width:500px;
  max-width:96vw; max-height:92vh; overflow-y:auto;
  box-shadow:0 8px 40px rgba(46,95,122,.18);
`
const FormRow = styled.div`
  display:grid; grid-template-columns:1fr 1fr; gap:12px;
`
const ModalFooter = styled.div`
  display:flex; justify-content:flex-end; gap:8px; margin-top:20px;
  padding-top:14px; border-top:1px solid #e8f0f5;
`

// ── Donut chart ───────────────────────────────────────────
function DonutChart({ entries, total, count }) {
  const cx=62, cy=62, R=54, Ri=34
  let cum=0
  const slices = entries.map(([,v], i) => {
    const pct = v/total
    const a1 = cum*2*Math.PI - Math.PI/2
    const a2 = (cum+pct)*2*Math.PI - Math.PI/2
    cum += pct
    const x1=cx+R*Math.cos(a1), y1=cy+R*Math.sin(a1)
    const x2=cx+R*Math.cos(a2), y2=cy+R*Math.sin(a2)
    const xi1=cx+Ri*Math.cos(a1), yi1=cy+Ri*Math.sin(a1)
    const xi2=cx+Ri*Math.cos(a2), yi2=cy+Ri*Math.sin(a2)
    const lg = pct>.5?1:0
    return <path key={i} d={`M${xi1.toFixed(1)},${yi1.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R},0,${lg},1,${x2.toFixed(1)},${y2.toFixed(1)} L${xi2.toFixed(1)},${yi2.toFixed(1)} A${Ri},${Ri},0,${lg},0,${xi1.toFixed(1)},${yi1.toFixed(1)} Z`} fill={FORMA_COLORS[i%FORMA_COLORS.length]} opacity="0.9"/>
  })
  return (
    <svg viewBox="0 0 124 124" width="124" height="124" style={{flexShrink:0}}>
      {slices}
      <circle cx={cx} cy={cy} r={Ri} fill="white"/>
      <text x={cx} y={cy-5} textAnchor="middle" fontSize="9" fill="#9aaebb" fontFamily="inherit">pagamentos</text>
      <text x={cx} y={cy+11} textAnchor="middle" fontSize="17" fontWeight="700" fill="#2e5f7a" fontFamily="inherit">{count}</text>
    </svg>
  )
}

// ── Stacked bar chart ─────────────────────────────────────
function StackedBarChart({ bins, paid }) {
  const W=440, H=128, padX=28, padY=14
  const n = bins.length
  const bw = Math.min(52, Math.floor((W-2*padX)/n*0.62))
  const bspace = (W-2*padX)/n
  const binData = bins.map(b => ({ ...b, items: paid.filter(f=>f.data.startsWith(b.pfx)) }))
  const maxB = Math.max(...binData.map(b=>b.items.reduce((a,f)=>a+f.valor,0)),1)

  const grids = [1,2,3].map(g => {
    const yg = (H-padY)-(g/4)*(H-2*padY)
    return <line key={g} x1={padX} y1={yg.toFixed(1)} x2={W-padX} y2={yg.toFixed(1)} stroke="#e8f0f5" strokeWidth="1"/>
  })

  const bars = binData.map((b,i) => {
    const x = padX + i*bspace + (bspace-bw)/2
    const total = b.items.reduce((a,f)=>a+f.valor,0)
    const g = { Fisioterapia:0, Nutrição:0, Psicologia:0, Outros:0 }
    b.items.forEach(f => { g[classEsp(f.svc)] += f.valor })
    let yOff = H-padY
    const rects = ['Fisioterapia','Nutrição','Psicologia','Outros'].map(k => {
      if (!g[k]) return null
      const bh = Math.max(3, Math.round(g[k]/maxB*(H-2*padY)))
      yOff -= bh
      return <rect key={k} x={x.toFixed(1)} y={yOff.toFixed(1)} width={bw} height={bh} rx="3" fill={ESP_COLORS[k]} opacity="0.85"/>
    })
    return (
      <g key={i}>
        {rects}
        <text x={(x+bw/2).toFixed(1)} y={H-1} textAnchor="middle" fontSize="9.5" fill="#9aaebb" fontFamily="inherit">{b.label}</text>
        {total>0 && <text x={(x+bw/2).toFixed(1)} y={(yOff-5).toFixed(1)} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#2e5f7a" fontFamily="inherit">{fmt(total)}</text>}
      </g>
    )
  })
  return <svg height={H} viewBox={`0 0 ${W} ${H}`} style={{width:'100%'}}>{grids}{bars}</svg>
}

// ── HorizBar rows ─────────────────────────────────────────
function HorizBars({ entries, maxVal, colorMap, showDot=false, showCount=false, countItems=[], countKey='' }) {
  return entries.map(([k,v],i) => {
    const c = colorMap?.[k] || FORMA_COLORS[i%FORMA_COLORS.length]
    const total = entries.reduce((a,[,x])=>a+x,0)||1
    const share = Math.round(v/total*100)
    const n2 = countItems.filter(f=>(f[countKey]||'Avulso')===k).length
    return (
      <div key={k} style={{marginBottom:10}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            {showDot && <div style={{width:9,height:9,borderRadius:'50%',background:c,flexShrink:0}}/>}
            {showCount && (
              <div style={{width:24,height:24,borderRadius:6,background:`${c}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:c}}/>
              </div>
            )}
            <div>
              <div style={{fontSize:12,fontWeight:600,color:'#2e5f7a'}}>{showDot ? k.replace('Dra. ','').replace('Dr. ','') : k}</div>
              {showCount && <div style={{fontSize:9.5,color:'#9aaebb'}}>{n2} consulta{n2!==1?'s':''}</div>}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:7,textAlign:'right'}}>
            <span style={{fontSize:10,color:'#9aaebb',background:'#f0f5f8',padding:'1px 7px',borderRadius:20}}>{share}%</span>
            <span style={{fontSize:13,fontWeight:700,color:c}}>{fmt(v)}</span>
          </div>
        </div>
        <div style={{height:6,background:'#f0f5f8',borderRadius:3,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${Math.round(v/maxVal*100)}%`,background:`linear-gradient(90deg,${c}aa,${c})`,borderRadius:3,transition:'width .5s ease'}}/>
        </div>
      </div>
    )
  })
}

// ── Main ──────────────────────────────────────────────────
const EMPTY_FORM = { pacNome:'', svc:'Fisioterapia', prof:'', plano:'Básico', valor:'', status:'Pago', forma:'Pix', data:'' }

export default function FinancePage() {
  const { isAdmin } = useAuth()
  const [all,      setAll]      = useState([])
  const [period,   setPeriod]   = useState('sem')
  const [filtSt,   setFiltSt]   = useState('')
  const [filtPr,   setFiltPr]   = useState('')
  const [filtSvc,  setFiltSvc]  = useState('')
  const [filtPl,   setFiltPl]   = useState('')
  const [modal,    setModal]    = useState(false)
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [patients, setPatients] = useState([])
  const [profs,    setProfs]    = useState([])

  const load = () => getFinances().then(data => setAll(data.length ? data : MOCK)).catch(()=>setAll(MOCK))

  useEffect(() => {
    load()
    getPatients().then(setPatients).catch(()=>{})
    getProfessionals().then(setProfs).catch(()=>{})
  }, [])

  // Period filtered items
  const periodItems = useMemo(() => filterByPeriod(all, period), [all, period])
  const paid = useMemo(() => periodItems.filter(f=>f.status==='Pago'), [periodItems])

  // KPIs
  const totalPago   = paid.reduce((a,f)=>a+f.valor,0)
  const totalPend   = all.filter(f=>f.status==='Pendente').reduce((a,f)=>a+f.valor,0)
  const pendCount   = all.filter(f=>f.status==='Pendente').length
  const ticket      = paid.length ? Math.round(totalPago/paid.length) : 0

  // Table filtered
  const tableItems = useMemo(() => {
    let list = [...all]
    if (filtSt)  list = list.filter(f=>f.status===filtSt)
    if (filtPr)  list = list.filter(f=>f.prof===filtPr)
    if (filtSvc) list = list.filter(f=>f.svc===filtSvc)
    if (filtPl)  list = list.filter(f=>(f.plano||'Avulso')===filtPl)
    return list.sort((a,b)=>b.data.localeCompare(a.data))
  }, [all,filtSt,filtPr,filtSvc,filtPl])

  const tableTotal = tableItems.filter(f=>f.status==='Pago').reduce((a,f)=>a+f.valor,0)

  // By prof
  const byProf = useMemo(()=>{
    const m={}; paid.forEach(f=>{m[f.prof]=(m[f.prof]||0)+f.valor}); return Object.entries(m).sort((a,b)=>b[1]-a[1])
  },[paid])
  const maxProf = Math.max(...byProf.map(([,v])=>v),1)

  // By esp
  const byEsp = useMemo(()=>{
    const m={Fisioterapia:0,Nutrição:0,Psicologia:0,Outros:0}; paid.forEach(f=>{m[classEsp(f.svc)]+=f.valor})
    return Object.entries(m).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1])
  },[paid])
  const maxEsp = Math.max(...byEsp.map(([,v])=>v),1)

  // By plano
  const byPlano = useMemo(()=>{
    const m={Fidelidade:0,Premium:0,Básico:0,Avulso:0}
    paid.forEach(f=>{const pl=f.plano||'Avulso'; m[pl]!==undefined?m[pl]+=f.valor:m.Avulso+=f.valor})
    return Object.entries(m).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1])
  },[paid])
  const maxPlano = Math.max(...byPlano.map(([,v])=>v),1)

  // By forma (donut)
  const formaEntries = useMemo(()=>{
    const m={}; paid.forEach(f=>{const k=f.forma==='—'?'Outros':f.forma; m[k]=(m[k]||0)+f.valor})
    return Object.entries(m).sort((a,b)=>b[1]-a[1])
  },[paid])
  const formaTotal = formaEntries.reduce((a,[,v])=>a+v,0)||1

  const set = k => e => setForm(f=>({...f,[k]:e.target.value}))

  const handleSave = async () => {
    if (!form.pacNome || !form.svc || !form.valor || !form.data) return
    try {
      await createFinance({ ...form, valor: parseFloat(form.valor) })
      setModal(false); setForm(EMPTY_FORM); load()
    } catch(e) { console.error(e) }
  }

  if (!isAdmin) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'60vh',color:'#bfcdd8',gap:12}}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#dce4eb" strokeWidth="2"/><path d="M24 16v10M24 30v2" stroke="#bfcdd8" strokeWidth="2.5" strokeLinecap="round"/></svg>
      <p style={{fontSize:14,fontWeight:600}}>Dados financeiros restritos</p>
    </div>
  )

  const bins = PERIOD_BINS[period] || PERIOD_BINS.sem

  return (
    <div>
      <PageHeader>
        <div><PageTitle>Receitas & Pagamentos</PageTitle><PageSub>Visão financeira completa da clínica</PageSub></div>
        <PrimaryButton onClick={()=>{ setForm({...EMPTY_FORM, data:new Date().toISOString().slice(0,10)}); setModal(true) }}>+ Novo lançamento</PrimaryButton>
      </PageHeader>

      {/* KPIs */}
      <KpiGrid>
        <KpiCard>
          <KpiIcon $bg="#e0f3f8"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v14M6 7l4-4 4 4" stroke="#3a7a9c" strokeWidth="1.6" strokeLinecap="round"/></svg></KpiIcon>
          <div>
            <div style={{fontSize:22,fontWeight:800,color:'#2e5f7a'}}>{fmt(totalPago)}</div>
            <div style={{fontSize:11,color:'#9aaebb'}}>Receita (período)</div>
            <div style={{fontSize:10.5,color:'#2e9ac4',marginTop:2}}>{paid.length} consultas pagas</div>
          </div>
        </KpiCard>
        <KpiCard>
          <KpiIcon $bg="#e8f5fa"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="12" rx="2" stroke="#2e9ac4" strokeWidth="1.6"/><path d="M3 8h14" stroke="#2e9ac4" strokeWidth="1.6"/><circle cx="7" cy="12" r="1" fill="#2e9ac4"/></svg></KpiIcon>
          <div>
            <div style={{fontSize:22,fontWeight:800,color:'#2e5f7a'}}>{fmt(totalPago)}</div>
            <div style={{fontSize:11,color:'#9aaebb'}}>Total recebido</div>
            <div style={{fontSize:10.5,color:'#2e9ac4',marginTop:2}}>confirmado</div>
          </div>
        </KpiCard>
        <KpiCard>
          <KpiIcon $bg="#fef3e2"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#c8821a" strokeWidth="1.6"/><path d="M10 6v4M10 14v.5" stroke="#c8821a" strokeWidth="2" strokeLinecap="round"/></svg></KpiIcon>
          <div>
            <div style={{fontSize:22,fontWeight:800,color:'#2e5f7a'}}>{fmt(totalPend)}</div>
            <div style={{fontSize:11,color:'#9aaebb'}}>A receber</div>
            <div style={{fontSize:10.5,color:'#c8821a',marginTop:2}}>{pendCount} em aberto</div>
          </div>
        </KpiCard>
        <KpiCard>
          <KpiIcon $bg="#e8eef4"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 16l4-5 3 3 3-4 4 6" stroke="#2e5f7a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></KpiIcon>
          <div>
            <div style={{fontSize:22,fontWeight:800,color:'#2e5f7a'}}>{ticket ? fmt(ticket) : '—'}</div>
            <div style={{fontSize:11,color:'#9aaebb'}}>Ticket médio</div>
            <div style={{fontSize:10.5,color:'#9aaebb',marginTop:2}}>por consulta paga</div>
          </div>
        </KpiCard>
      </KpiGrid>

      {/* Period selector */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}>
        <span style={{fontSize:11.5,fontWeight:600,color:'#7a90a0'}}>Período:</span>
        <PTabBar>
          {[['mes','Este mês'],['trim','Trimestre'],['sem','Semestre'],['ano','Ano todo'],['tudo','Histórico']].map(([k,l])=>(
            <PTab key={k} $active={period===k} onClick={()=>setPeriod(k)}>{l}</PTab>
          ))}
        </PTabBar>
        <span style={{fontSize:11,color:'#9aaebb',marginLeft:4}}>{PERIOD_LABEL[period]}</span>
      </div>

      {/* Row 1: Evolução + Por profissional */}
      <Charts2>
        <Card>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <SectionLabel style={{marginBottom:0}}>Evolução de receita</SectionLabel>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {Object.entries(ESP_COLORS).map(([k,c])=>(
                <div key={k} style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:'#7a90a0'}}>
                  <span style={{width:8,height:8,borderRadius:2,background:c,display:'inline-block',flexShrink:0}}/>
                  {k}
                </div>
              ))}
            </div>
          </div>
          <StackedBarChart bins={bins} paid={paid}/>
        </Card>
        <Card>
          <SectionLabel>Por profissional</SectionLabel>
          {byProf.length
            ? <HorizBars entries={byProf} maxVal={maxProf} colorMap={PROF_COLOR} showDot/>
            : <div style={{color:'#bfcdd8',fontSize:12.5,textAlign:'center',padding:12}}>Sem dados no período</div>}
        </Card>
      </Charts2>

      {/* Row 2: especialidade + plano + forma */}
      <Charts3>
        <Card>
          <SectionLabel>Por especialidade</SectionLabel>
          {byEsp.length
            ? <HorizBars entries={byEsp} maxVal={maxEsp} colorMap={ESP_COLORS}/>
            : <div style={{color:'#bfcdd8',fontSize:12.5,textAlign:'center',padding:12}}>Sem dados no período</div>}
        </Card>
        <Card>
          <SectionLabel>Por tipo de plano</SectionLabel>
          {byPlano.length
            ? <HorizBars entries={byPlano} maxVal={maxPlano} colorMap={PLANO_COLOR} showCount countItems={paid} countKey="plano"/>
            : <div style={{color:'#bfcdd8',fontSize:12.5,textAlign:'center',padding:12}}>Sem dados no período</div>}
        </Card>
        <Card>
          <SectionLabel>Por forma de pagamento</SectionLabel>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            {formaEntries.length>0 && <DonutChart entries={formaEntries} total={formaTotal} count={paid.length}/>}
            <div style={{display:'flex',flexDirection:'column',gap:7,flex:1}}>
              {formaEntries.slice(0,5).map(([k,v],i)=>{
                const share = Math.round(v/formaTotal*100)
                const c = FORMA_COLORS[i%FORMA_COLORS.length]
                return (
                  <div key={k} style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:10,height:10,borderRadius:3,background:c,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11.5,fontWeight:600,color:'#2e5f7a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{k}</div>
                      <div style={{fontSize:10,color:'#9aaebb'}}>{fmt(v)} · {share}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </Charts3>

      {/* Row 3: Lançamentos */}
      <Card>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,flexWrap:'wrap',gap:8}}>
          <SectionLabel style={{marginBottom:0}}>Lançamentos</SectionLabel>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <FormSelect value={filtSt} onChange={e=>setFiltSt(e.target.value)} style={{width:130,fontSize:12}}>
              <option value="">Todos os status</option><option>Pago</option><option>Pendente</option><option>Cancelado</option>
            </FormSelect>
            <FormSelect value={filtPr} onChange={e=>setFiltPr(e.target.value)} style={{width:170,fontSize:12}}>
              <option value="">Todos os profissionais</option>
              <option>Dra. Camila Torres</option><option>Dr. Rafael Nunes</option>
              <option>Dra. Beatriz Lemos</option><option>Dr. André Melo</option>
            </FormSelect>
            <FormSelect value={filtSvc} onChange={e=>setFiltSvc(e.target.value)} style={{width:175,fontSize:12}}>
              <option value="">Todos os serviços</option>
              <option>Fisioterapia</option><option>Nutrição</option><option>Psicologia</option>
              <option>Terapia Manual</option><option>Acupuntura</option><option>Bioimpedância</option>
              <option>Avaliação Inicial</option><option>Orientação em Grupo</option>
            </FormSelect>
            <FormSelect value={filtPl} onChange={e=>setFiltPl(e.target.value)} style={{width:140,fontSize:12}}>
              <option value="">Todos os planos</option>
              <option>Básico</option><option>Premium</option><option>Fidelidade</option><option>Avulso</option>
            </FormSelect>
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
            <thead>
              <tr style={{fontSize:9.5,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.6px'}}>
                {['Data','Paciente','Serviço','Profissional','Plano','Valor','Forma','Status',''].map(h=>(
                  <th key={h} style={{textAlign:'left',padding:'7px 10px',fontWeight:700,borderBottom:'1px solid #e8f0f5'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableItems.map(f=>(
                <tr key={f.id} style={{borderBottom:'1px solid #f5f8fa'}}>
                  <td style={{padding:'10px',fontSize:12,whiteSpace:'nowrap',color:'#587080'}}>{fmtDate(f.data)}</td>
                  <td style={{padding:'10px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9}}>
                      <div style={{width:28,height:28,borderRadius:'50%',background:'#cce9f5',color:'#2e5f7a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9.5,fontWeight:700,flexShrink:0}}>{ini(f.pacNome)}</div>
                      <span style={{fontWeight:600,fontSize:12.5,color:'#2e5f7a'}}>{f.pacNome}</span>
                    </div>
                  </td>
                  <td style={{padding:'10px',fontSize:12,color:'#587080'}}>{f.svc}</td>
                  <td style={{padding:'10px',fontSize:11.5,color:'#9aaebb'}}>{f.prof?.replace('Dra. ','').replace('Dr. ','')}</td>
                  <td style={{padding:'10px'}}><Badge $variant={PLANO_BADGE[f.plano||'Avulso']||'gray'}>{f.plano||'Avulso'}</Badge></td>
                  <td style={{padding:'10px',fontWeight:700,color:f.status==='Pago'?'#2e9ac4':'#c8821a'}}>{fmt(f.valor)}</td>
                  <td style={{padding:'10px',fontSize:11,color:'#9aaebb'}}>{f.forma}</td>
                  <td style={{padding:'10px'}}><Badge $variant={STATUS_BADGE[f.status]||'gray'}>{f.status}</Badge></td>
                  <td style={{padding:'10px'}}>
                    <button style={{border:'none',background:'#f0f5f8',borderRadius:6,cursor:'pointer',padding:'4px 7px',color:'#7a90a0'}} title="Editar">
                      <svg width="10" height="10" viewBox="0 0 11 11" fill="none"><path d="M7.5 1.5l2 2-6.5 6.5H1V8l6.5-6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:8,fontSize:11.5,color:'#9aaebb',textAlign:'right'}}>
          {tableItems.length} lançamento{tableItems.length!==1?'s':''} · Recebido filtrado: <strong style={{color:'#2e9ac4'}}>{fmt(tableTotal)}</strong>
        </div>
      </Card>

      {/* Modal novo lançamento */}
      {modal && (
        <Modal onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <ModalCard>
            <div style={{fontSize:15,fontWeight:700,marginBottom:18}}>Novo lançamento</div>
            <FormGroup>
              <FormLabel>Paciente *</FormLabel>
              <FormInput value={form.pacNome} onChange={set('pacNome')} list="pac-list" placeholder="Nome do paciente"/>
              <datalist id="pac-list">{patients.map(p=><option key={p.id} value={p.nome}/>)}</datalist>
            </FormGroup>
            <FormRow>
              <FormGroup>
                <FormLabel>Serviço *</FormLabel>
                <FormSelect value={form.svc} onChange={set('svc')}>
                  <option>Fisioterapia</option><option>Nutrição</option><option>Psicologia</option>
                  <option>Terapia Manual</option><option>Acupuntura</option><option>Bioimpedância</option>
                  <option>Avaliação Inicial</option><option>Orientação em Grupo</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Profissional</FormLabel>
                <FormSelect value={form.prof} onChange={set('prof')}>
                  <option value="">—</option>
                  {profs.map(p=><option key={p.id} value={p.nome}>{p.nome}</option>)}
                </FormSelect>
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Plano</FormLabel>
                <FormSelect value={form.plano} onChange={set('plano')}>
                  <option>Básico</option><option>Premium</option><option>Fidelidade</option><option>Avulso</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Valor (R$) *</FormLabel>
                <FormInput type="number" value={form.valor} onChange={set('valor')} placeholder="150"/>
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel>Status</FormLabel>
                <FormSelect value={form.status} onChange={set('status')}>
                  <option>Pago</option><option>Pendente</option><option>Cancelado</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Forma de pagamento</FormLabel>
                <FormSelect value={form.forma} onChange={set('forma')}>
                  <option>Pix</option><option>Cartão de crédito</option><option>Cartão de débito</option>
                  <option>Dinheiro</option><option>Transferência</option><option>Plano de saúde</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
            <FormGroup>
              <FormLabel>Data *</FormLabel>
              <FormInput type="date" value={form.data} onChange={set('data')}/>
            </FormGroup>
            <ModalFooter>
              <Button onClick={()=>setModal(false)}>Cancelar</Button>
              <PrimaryButton onClick={handleSave}>Salvar lançamento</PrimaryButton>
            </ModalFooter>
          </ModalCard>
        </Modal>
      )}
    </div>
  )
}
