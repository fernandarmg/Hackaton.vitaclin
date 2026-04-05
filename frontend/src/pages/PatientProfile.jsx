import { useState } from 'react'
import styled from 'styled-components'
import { getAppointments } from '../services/api'
import { useEffect } from 'react'

// ── Styled ───────────────────────────────────────────────
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
  padding: 22px; min-height: 260px;
`

const InfoGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
`
const InfoItem = styled.div`
  background: #f5f8fa; border-radius: 8px; padding: 12px 14px; border: 1px solid #e8f0f5;
`

const Badge = styled.span`
  display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 20px;
  font-size: 11px; font-weight: 600; white-space: nowrap;
  background: ${({$bg}) => $bg || '#edf1f5'}; color: ${({$color}) => $color || '#587080'};
`

const AnamSection = styled.div` margin-bottom: 22px; `
const AnamTitle = styled.div`
  font-size: 12px; font-weight: 700; color: #2e9ac4; text-transform: uppercase;
  letter-spacing: .5px; margin-bottom: 10px; padding-bottom: 6px;
  border-bottom: 2px solid #cce9f5;
`
const Textarea = styled.textarea`
  width: 100%; padding: 8px 12px; border: 1px solid #d1dde6; border-radius: 8px;
  font-size: 13px; font-family: inherit; background: #fff; resize: vertical;
  min-height: 64px; outline: none; transition: border-color .15s; box-sizing: border-box;
  &:focus { border-color: #2e9ac4; box-shadow: 0 0 0 3px rgba(46,154,196,.1); }
`
const Input = styled.input`
  width: 100%; padding: 8px 12px; border: 1px solid #d1dde6; border-radius: 8px;
  font-size: 13px; font-family: inherit; background: #fff; outline: none; box-sizing: border-box;
  &:focus { border-color: #2e9ac4; }
`
const Select = styled.select`
  width: 100%; padding: 7px 12px; border: 1px solid #d1dde6; border-radius: 8px;
  font-size: 13px; font-family: inherit; background: #fff; outline: none; box-sizing: border-box;
`
const Lbl = styled.label`
  display: block; font-size: 10px; font-weight: 700; color: #7a90a0;
  margin-bottom: 4px; text-transform: uppercase; letter-spacing: .3px;
`
const FG = styled.div` margin-bottom: 12px; `

const ProgRow = styled.div`
  display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
`
const ProgBar = styled.div`
  flex: 1; height: 9px; background: #e8f0f5; border-radius: 5px; overflow: hidden;
`
const ProgFill = styled.div`
  height: 100%; border-radius: 5px;
  background: ${({$color}) => $color}; width: ${({$pct}) => $pct}%;
`

const ResultCard = styled.div`
  background: #f5f8fa; border-radius: 12px; padding: 14px; margin-bottom: 10px;
  border-left: 3px solid #2e9ac4;
`
const HistItem = styled.div`
  display: flex; align-items: center; gap: 12px; padding: 10px 14px;
  border-radius: 8px; border: 1px solid #e8f0f5; margin-bottom: 7px;
  &:hover { background: #f5f8fa; }
`

// ── Utils ────────────────────────────────────────────────
const initials = n => n?.trim().split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?'
const fmtDate  = d => !d ? '—' : d.split('-').reverse().join('/')
const daysSince = d => !d ? 999 : Math.floor((new Date() - new Date(d)) / 86400000)
const age = nasc => !nasc ? '—' : Math.floor((new Date() - new Date(nasc)) / (365.25*86400000))

const ESP_BADGE = {
  Fisioterapia: { bg:'#cce9f5', color:'#2e5f7a' },
  Nutrição:     { bg:'#fde8c2', color:'#a6670e' },
  Psicologia:   { bg:'#dceaf0', color:'#2e5f7a' },
}
const PLANO_BADGE = {
  Premium:    { bg:'#fde8c2', color:'#a6670e' },
  Fidelidade: { bg:'#cce9f5', color:'#2e5f7a' },
  Básico:     { bg:'#dceaf0', color:'#2e5f7a' },
  Avulso:     { bg:'#edf1f5', color:'#587080' },
}
const FREQ_BADGE = {
  '2x/semana': { bg:'#cce9f5', color:'#2e9ac4' },
  'Semanal':   { bg:'#cce9f5', color:'#2e5f7a' },
  'Quinzenal': { bg:'#fde8c2', color:'#a6670e' },
  'Mensal':    { bg:'#dceaf0', color:'#2e5f7a' },
}

// ── ANAMNESE sections ────────────────────────────────────
const ANAMNESE = {
  Fisioterapia: [
    { t:'Identificação e Queixa Principal', fields:[
      { l:'Queixa principal', ph:'Descreva o problema…', rows:2 },
      { l:'Tempo de início dos sintomas', ph:'Ex: há 3 meses…', rows:1 },
      { l:'Mecanismo de lesão / causa provável', ph:'Ex: acidente, queda…', rows:2 },
    ]},
    { t:'História Pregressa', fields:[
      { l:'Cirurgias anteriores', ph:'Tipos, datas e locais…', rows:2 },
      { l:'Doenças crônicas', ph:'Ex: hipertensão, diabetes…', rows:2 },
      { l:'Medicamentos em uso', ph:'Nome, dose e frequência…', rows:2 },
    ]},
    { t:'Avaliação da Dor', fields:[
      { l:'Localização da dor', ph:'Ex: joelho direito…', rows:1 },
      { l:'Característica da dor', ph:'Ex: queimação, pontada…', rows:1 },
      { l:'Fatores de melhora', ph:'Ex: repouso, calor…', rows:1 },
      { l:'Fatores de piora', ph:'Ex: subir escada…', rows:1 },
    ]},
    { t:'Hábitos e Vida Social', fields:[
      { l:'Atividade física regular', ph:'Tipo, frequência…', rows:1 },
      { l:'Ocupação profissional', ph:'Função, carga horária…', rows:1 },
      { l:'Qualidade do sono', ph:'Horas, interrupções…', rows:1 },
    ]},
    { t:'Objetivos do Tratamento', fields:[
      { l:'Expectativas do paciente', ph:'O que espera alcançar?', rows:2 },
      { l:'Observações do profissional', ph:'Impressão clínica inicial…', rows:3 },
    ]},
  ],
  Nutrição: [
    { t:'Histórico Alimentar', fields:[
      { l:'Refeições por dia', ph:'Quantas refeições faz?', rows:1 },
      { l:'Alimentos frequentes', ph:'Descreva a alimentação habitual…', rows:2 },
      { l:'Restrições alimentares', ph:'Alergias, intolerâncias…', rows:1 },
    ]},
    { t:'Histórico de Saúde', fields:[
      { l:'Doenças diagnosticadas', ph:'Ex: diabetes, hipertensão…', rows:2 },
      { l:'Medicamentos em uso', ph:'Nome e dosagem…', rows:2 },
      { l:'Exames recentes', ph:'Resultados relevantes…', rows:2 },
    ]},
    { t:'Objetivos e Hábitos', fields:[
      { l:'Objetivo principal', ph:'Perda de peso, ganho de massa…', rows:1 },
      { l:'Prática de exercícios', ph:'Tipo e frequência…', rows:1 },
      { l:'Ingestão de água', ph:'Litros por dia…', rows:1 },
      { l:'Observações', ph:'Outras informações relevantes…', rows:2 },
    ]},
  ],
  Psicologia: [
    { t:'Motivo da Consulta', fields:[
      { l:'Queixa principal', ph:'O que trouxe você até aqui?', rows:2 },
      { l:'Início dos sintomas', ph:'Quando começou?', rows:1 },
      { l:'Fatores desencadeantes', ph:'O que percebe que piora?', rows:2 },
    ]},
    { t:'História Pessoal', fields:[
      { l:'Histórico familiar', ph:'Doenças mentais na família…', rows:2 },
      { l:'Tratamentos anteriores', ph:'Terapias, medicamentos…', rows:2 },
      { l:'Medicamentos em uso', ph:'Nome e dosagem…', rows:1 },
    ]},
    { t:'Contexto de Vida', fields:[
      { l:'Ocupação/escola', ph:'Situação profissional atual…', rows:1 },
      { l:'Relacionamentos', ph:'Família, amigos, parceiro(a)…', rows:1 },
      { l:'Qualidade do sono', ph:'Horas, pesadelos, insônia…', rows:1 },
      { l:'Objetivos terapêuticos', ph:'O que espera da terapia?', rows:2 },
    ]},
  ],
}

// ── BODY MAP (Fisioterapia) ──────────────────────────────
// imgX/imgY = % position over the body image (left/top)
const BODY_PARTS = [
  { id:'cabeca',     label:'Cabeça/Pescoço', imgX:51, imgY:13, status:'bom',           score:90, desc:'Sem queixas. Mobilidade cervical preservada.' },
  { id:'ombros',     label:'Ombros',          imgX:51, imgY:26, status:'bom',           score:75, desc:'Amplitude articular normal bilateralmente.' },
  { id:'cotovelos',  label:'Cotovelos/Braço', imgX:51, imgY:43, status:'bom',           score:80, desc:'Sem limitações funcionais observadas.' },
  { id:'lombar',     label:'Lombar/Coluna',   imgX:51, imgY:54, status:'atencao',       score:50, desc:'Tensão muscular leve. Postura anteriorizada.' },
  { id:'joelhos',    label:'Joelhos',         imgX:51, imgY:73, status:'em_tratamento', score:40, desc:'Pós-cirúrgico. Amplitude: 120°. Dor EVA 3/10.' },
  { id:'tornozelos', label:'Tornozelos/Pé',   imgX:51, imgY:90, status:'bom',           score:85, desc:'Mobilidade preservada. Sem edema.' },
]
const STATUS_COLOR = { bom:'#2e9ac4', atencao:'#c8821a', em_tratamento:'#e05858' }
const STATUS_LABEL = { bom:'Bom', atencao:'Atenção', em_tratamento:'Em tratamento' }


const BODY_FILTER = 'brightness(0) invert(1) sepia(1) hue-rotate(155deg) saturate(5) brightness(0.65) opacity(0.6)'

function BodyMapSVG({ parts, selected, onSelect }) {
  return (
    <div>
      {/* Body image full-width with dots */}
      <div style={{position:'relative', width:'100%'}}>
        <img src="/body.png" alt="" style={{
          width:'100%', height:'auto', display:'block',
          filter: BODY_FILTER, pointerEvents:'none',
        }}/>
        {parts.map(part => {
          const col = STATUS_COLOR[part.status]
          const isSel = selected === part.id
          return (
            <div key={part.id} onClick={() => onSelect(part.id)} title={part.label} style={{
              position:'absolute',
              left: part.imgX + '%',
              top: part.imgY + '%',
              width: isSel ? 18 : 14,
              height: isSel ? 18 : 14,
              borderRadius: '50%',
              background: col,
              border: `${isSel ? 3 : 2}px solid #fff`,
              transform: 'translate(-50%,-50%)',
              cursor: 'pointer',
              boxShadow: isSel
                ? `0 0 0 4px ${col}44, 0 2px 8px rgba(0,0,0,.25)`
                : '0 2px 6px rgba(0,0,0,.22)',
              zIndex: 2, transition: 'all .15s',
            }}/>
          )
        })}
      </div>

      {/* Clickable labels below the image */}
      <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:3}}>
        {parts.map(part => {
          const col = STATUS_COLOR[part.status]
          const isSel = selected === part.id
          return (
            <div key={part.id} onClick={() => onSelect(part.id)} style={{
              display:'flex', alignItems:'center', gap:8,
              padding:'4px 10px', borderRadius:8, cursor:'pointer',
              background: isSel ? col+'18' : 'transparent',
              transition:'all .15s',
            }}>
              <div style={{
                width: isSel?10:8, height: isSel?10:8,
                borderRadius:'50%', background:col, flexShrink:0,
                boxShadow: isSel ? `0 0 0 3px ${col}33` : 'none',
                transition:'all .15s',
              }}/>
              <span style={{
                fontSize:11.5, fontWeight: isSel?700:400,
                color: isSel?col:'#7a90a0', transition:'all .15s',
              }}>{part.label}</span>
              {isSel && (
                <span style={{marginLeft:'auto',fontSize:10,fontWeight:700,color:col}}>
                  {STATUS_LABEL[part.status]}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Status legend */}
      <div style={{display:'flex',gap:14,marginTop:10,fontSize:10,color:'#9aaebb',paddingLeft:10}}>
        {Object.entries(STATUS_LABEL).map(([k,l]) => (
          <div key={k} style={{display:'flex',alignItems:'center',gap:4}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:STATUS_COLOR[k]}}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── RESULTADOS data ──────────────────────────────────────
const RESULTADOS = {
  Fisioterapia: {
    prog: [
      { label:'Amplitude de movimento',    val:72, color:'#2e9ac4' },
      { label:'Nível de dor (invertido)',   val:65, color:'#3a7a9c' },
      { label:'Força muscular',             val:58, color:'#c8821a' },
      { label:'Função global',              val:70, color:'#2e5f7a' },
    ],
    reports: [
      { date:'Mar 2026', title:'Evolução mensal',  body:'Redução de dor EVA 7→4. ADM de joelho: 90°→120°. Paciente aderente ao protocolo.' },
      { date:'Fev 2026', title:'Reavaliação',      body:'Força do quadríceps em melhora. Marcha normalizada em plano.' },
    ],
  },
  Nutrição: {
    prog: [
      { label:'Adesão alimentar',      val:80, color:'#c8821a' },
      { label:'Controle glicêmico',    val:62, color:'#2e9ac4' },
      { label:'Hidratação',            val:75, color:'#3a7a9c' },
      { label:'Composição corporal',   val:55, color:'#2e5f7a' },
    ],
    reports: [
      { date:'Mar 2026', title:'Revisão mensal', body:'Redução de 2,3kg. Glicemia em jejum: 118 mg/dL. Boa adesão ao plano.' },
      { date:'Fev 2026', title:'Reavaliação',    body:'Introdução de proteínas de alta qualidade. Hidratação melhorada.' },
    ],
  },
  Psicologia: {
    prog: [
      { label:'Regulação emocional',   val:68, color:'#2e5f7a' },
      { label:'Qualidade do sono',     val:55, color:'#2e9ac4' },
      { label:'Funcionamento social',  val:72, color:'#3a7a9c' },
      { label:'Autoestima',            val:60, color:'#c8821a' },
    ],
    reports: [
      { date:'Mar 2026', title:'Sessão de reavaliação', body:'Redução de crises de ansiedade. Técnicas de respiração incorporadas à rotina.' },
      { date:'Fev 2026', title:'Evolução bimestral',    body:'Melhora nos padrões de sono. Interações sociais mais confortáveis.' },
    ],
  },
}

// ── FORMULÁRIO fields (mirror de Resultados) ─────────────
const FORM_PARTES = [
  { id:'cabeca',     label:'Cabeça/Pescoço' },
  { id:'ombros',     label:'Ombros' },
  { id:'cotovelos',  label:'Cotovelos/Braço' },
  { id:'lombar',     label:'Lombar/Coluna' },
  { id:'joelhos',    label:'Joelhos' },
  { id:'tornozelos', label:'Tornozelos/Pé' },
]
const FORMULARIO = {
  Fisioterapia: {
    indicadores: [
      { id:'dor',      label:'Nível de dor atual (0–10)', type:'range', min:0, max:10 },
      { id:'amplitude',label:'Amplitude de movimento (°)', type:'number', ph:'120' },
      { id:'forca',    label:'Força muscular (0–5)', type:'range', min:0, max:5 },
      { id:'funcao',   label:'Função global (0–10)', type:'range', min:0, max:10 },
    ],
    relatorio: [
      { id:'titulo',    label:'Título do relatório', type:'text', ph:'Evolução mensal…' },
      { id:'descricao', label:'Descrição / evolução clínica', type:'textarea', ph:'Evolução detalhada, procedimentos e resposta ao tratamento…' },
    ],
  },
  Nutrição: {
    medidas: [
      { id:'peso',    label:'Peso (kg)',                  type:'number', ph:'58.2' },
      { id:'musculo', label:'Massa Muscular (kg)',         type:'number', ph:'27.9' },
      { id:'gordura', label:'Massa de Gordura (kg)',       type:'number', ph:'8.8' },
      { id:'imc',     label:'IMC (kg/m²)',                 type:'number', ph:'21.6' },
      { id:'pgc',     label:'PGC (%)',                     type:'number', ph:'15.1' },
      { id:'agua',    label:'Água Corporal Total (L)',     type:'number', ph:'36.3' },
      { id:'proteina',label:'Proteína (kg)',               type:'number', ph:'9.9' },
      { id:'minerais',label:'Minerais (kg)',               type:'number', ph:'3.20' },
      { id:'score',   label:'Pontuação InBody (0–100)',    type:'number', ph:'79' },
    ],
    relatorio: [
      { id:'titulo',    label:'Título do relatório', type:'text', ph:'Revisão mensal…' },
      { id:'descricao', label:'Descrição / evolução', type:'textarea', ph:'Evolução detalhada, ajustes no plano alimentar…' },
    ],
  },
  Psicologia: {
    indicadores: [
      { id:'humor',  label:'Humor geral (0–10)',           type:'range', min:0, max:10 },
      { id:'ansied', label:'Ansiedade — invertido (0–10)', type:'range', min:0, max:10 },
      { id:'sono',   label:'Qualidade do sono (0–10)',     type:'range', min:0, max:10 },
      { id:'social', label:'Funcionamento social (0–10)',  type:'range', min:0, max:10 },
    ],
    relatorio: [
      { id:'titulo',    label:'Título', type:'text', ph:'Sessão de reavaliação…' },
      { id:'descricao', label:'Evolução observada', type:'textarea', ph:'Dinâmicas, temas abordados, tarefas…' },
    ],
  },
}

// Retorna todos os campos de um formulário como array plano
const getAllFormFields = (esp) => {
  const fd = FORMULARIO[esp] || FORMULARIO.Fisioterapia
  return [
    ...(fd.indicadores||[]),
    ...(fd.medidas||[]),
    ...(fd.relatorio||[]),
  ]
}

// ── Tab content components ────────────────────────────────
function TabInfo({ p }) {
  const freq = p.freqPresc || '—'
  const days = daysSince(p.lastVisit)
  return (
    <InfoGrid>
      <InfoItem><Lbl>Telefone</Lbl><div style={{fontSize:13.5,fontWeight:600}}>{p.cont}</div></InfoItem>
      <InfoItem><Lbl>Nascimento</Lbl><div style={{fontSize:13.5,fontWeight:600}}>{fmtDate(p.nasc)} ({age(p.nasc)} anos)</div></InfoItem>
      <InfoItem><Lbl>Tipo sanguíneo</Lbl><div style={{fontSize:13.5,fontWeight:600}}>{p.sangue||'—'}</div></InfoItem>
      <InfoItem><Lbl>Peso</Lbl><div style={{fontSize:13.5,fontWeight:600}}>{p.peso||'—'}</div></InfoItem>
      <InfoItem><Lbl>Altura</Lbl><div style={{fontSize:13.5,fontWeight:600}}>{p.altura||'—'}</div></InfoItem>
      <InfoItem><Lbl>Profissional</Lbl><div style={{fontSize:13.5,fontWeight:600}}>{p.prof||'—'}</div></InfoItem>
      <InfoItem><Lbl>Frequência prescrita</Lbl><div style={{fontSize:13.5,fontWeight:600}}>{freq}</div></InfoItem>
      <InfoItem><Lbl>Última consulta</Lbl><div style={{fontSize:13.5,fontWeight:600}}>{fmtDate(p.lastVisit)} ({days} dias)</div></InfoItem>
      <InfoItem><Lbl>Plano</Lbl><div style={{fontSize:13.5,fontWeight:600}}>{p.plano||'—'}</div></InfoItem>
      <InfoItem style={{gridColumn:'1/-1'}}>
        <Lbl>Observações clínicas</Lbl>
        <div style={{fontSize:13,color:'#587080',lineHeight:1.7}}>{p.obs||'—'}</div>
      </InfoItem>
    </InfoGrid>
  )
}

function TabAnamnese({ p }) {
  const secs = ANAMNESE[p.esp] || ANAMNESE.Fisioterapia
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
        <div>
          <div style={{fontSize:15,fontWeight:700}}>Anamnese — {p.esp}</div>
          <div style={{fontSize:12,color:'#9aaebb',marginTop:2}}>Preenchimento inicial e histórico clínico completo</div>
        </div>
        <button style={{padding:'6px 14px',borderRadius:8,border:'none',background:'#2e9ac4',color:'#fff',fontWeight:700,cursor:'pointer',fontSize:13}}>
          Salvar anamnese
        </button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        {secs.map((sec, si) => (
          <AnamSection key={si} style={sec.fields.some(f=>f.rows>2)?{gridColumn:'1/-1'}:{}}>
            <AnamTitle>{sec.t}</AnamTitle>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {sec.fields.map((f, fi) => (
                <FG key={fi} style={f.rows>1?{gridColumn:'1/-1'}:{}}>
                  <Lbl>{f.l}</Lbl>
                  <Textarea rows={f.rows} placeholder={f.ph}/>
                </FG>
              ))}
            </div>
          </AnamSection>
        ))}
      </div>
    </div>
  )
}

function TabResultados({ p, avaliacoes }) {
  if (p.esp === 'Nutrição') return <TabResultadosNutricao avaliacoes={avaliacoes}/>

  const res = RESULTADOS[p.esp] || RESULTADOS.Fisioterapia
  const latestEval = avaliacoes?.[0]
  const lf = latestEval?.fields || {}
  const hasEval = !!latestEval

  // Progress bars: use eval data if available, else static
  const prog = hasEval ? [
    { label:'Amplitude de movimento', val: lf.amplitude ? Math.min(100,Math.round(parseFloat(lf.amplitude)/180*100)) : res.prog[0].val, color:'#2e9ac4' },
    { label:'Nível de dor (invertido)', val: lf.dor != null ? Math.round((1-parseFloat(lf.dor)/10)*100) : res.prog[1].val, color:'#3a7a9c' },
    { label:'Força muscular', val: lf.forca != null ? Math.round(parseFloat(lf.forca)/5*100) : res.prog[2].val, color:'#c8821a' },
    { label:'Função global', val: lf.funcao != null ? Math.round(parseFloat(lf.funcao)/10*100) : res.prog[3].val, color:'#2e5f7a' },
  ] : res.prog

  // Body parts: merge eval per-part data with static if available
  const parts = BODY_PARTS.map(bp => ({
    ...bp,
    status: lf[bp.id+'_status'] || bp.status,
    score:  lf[bp.id+'_score']  ? parseFloat(lf[bp.id+'_score']) : bp.score,
    desc:   lf[bp.id+'_desc']   || bp.desc,
  }))

  // Reports: from evaluations or static
  const reports = hasEval
    ? avaliacoes.slice(0,3).map(av => ({
        date:  fmtDate(av.date),
        title: av.fields?.titulo || 'Avaliação',
        body:  av.fields?.descricao || av.anotacoes || '—',
      }))
    : res.reports

  const defaultPart = parts.find(b => b.status === 'em_tratamento') || parts[0]
  const [selPartId, setSelPartId] = useState(defaultPart.id)
  const selPart = parts.find(b => b.id === selPartId) || parts[0]

  const indicatorsAndReports = (
    <>
      <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:10}}>
        Indicadores de Evolução {hasEval && <span style={{color:'#2e9ac4',fontWeight:700,fontSize:9}}>• última avaliação</span>}
      </div>
      {prog.map((r,i) => (
        <ProgRow key={i}>
          <div style={{fontSize:12.5,width:190,flexShrink:0,color:'#587080'}}>{r.label}</div>
          <ProgBar><ProgFill $pct={r.val} $color={r.color}/></ProgBar>
          <div style={{fontSize:12.5,fontWeight:700,minWidth:38,textAlign:'right',color:r.color}}>{r.val}%</div>
        </ProgRow>
      ))}
      <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:10,marginTop:18}}>
        Relatórios Recentes
      </div>
      {reports.map((r,i) => (
        <ResultCard key={i}>
          <div style={{fontSize:11,color:'#9aaebb',marginBottom:3}}>{r.date}</div>
          <div style={{fontSize:13.5,fontWeight:700,marginBottom:5}}>{r.title}</div>
          <div style={{fontSize:12.5,color:'#587080',lineHeight:1.7}}>{r.body}</div>
        </ResultCard>
      ))}
    </>
  )

  if (p.esp !== 'Fisioterapia') {
    return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}><div>{indicatorsAndReports}</div></div>
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'268px 1fr',gap:24}}>
      {/* Body map */}
      <div>
        <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:10}}>
          Mapa Corporal {hasEval && <span style={{color:'#2e9ac4',fontWeight:700,fontSize:9}}>• última avaliação</span>}
        </div>
        <BodyMapSVG parts={parts} selected={selPartId} onSelect={setSelPartId}/>
      </div>
      {/* Detail + indicators + reports */}
      <div>
        <div style={{background:'#f5f8fa',borderRadius:12,padding:'14px 16px',marginBottom:16,border:'1px solid #e2eaef'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div style={{fontSize:15,fontWeight:700}}>{selPart.label}</div>
            <span style={{fontSize:11,fontWeight:700,color:STATUS_COLOR[selPart.status]}}>{STATUS_LABEL[selPart.status]}</span>
          </div>
          <div style={{fontSize:10,color:'#9aaebb',marginBottom:4}}>Score</div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div style={{flex:1,height:8,background:'#e2eaef',borderRadius:4,overflow:'hidden'}}>
              <div style={{height:'100%',width:selPart.score+'%',background:STATUS_COLOR[selPart.status],borderRadius:4,transition:'width .3s'}}/>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:STATUS_COLOR[selPart.status]}}>{selPart.score}%</div>
          </div>
          <div style={{fontSize:12.5,color:'#587080',borderLeft:'3px solid #dde8f0',paddingLeft:10,lineHeight:1.6}}>
            {selPart.desc}
          </div>
        </div>
        {indicatorsAndReports}
      </div>
    </div>
  )
}

function TabHistorico({ p, avaliacoes }) {
  const [appts, setAppts] = useState([])
  const [expanded, setExpanded] = useState(null)
  useEffect(() => {
    getAppointments({}).then(all => setAppts(all.filter(a => a.pacNome === p.nome).sort((a,b)=>b.date.localeCompare(a.date))))
  }, [p.nome])
  const color = {Fisioterapia:'#2e9ac4',Nutrição:'#c8821a',Psicologia:'#2e5f7a'}[p.esp]||'#2e9ac4'

  // Merge appointments + evaluations into chronological timeline
  const evalEntries = avaliacoes.map(av => ({ ...av, _type:'avaliacao' }))
  const apptEntries = appts.map(a => ({ ...a, _type:'consulta' }))
  const timeline = [...evalEntries, ...apptEntries].sort((a,b) => {
    const da = a.date || '', db = b.date || ''
    return db.localeCompare(da)
  })

  if (timeline.length === 0)
    return <div style={{textAlign:'center',padding:40,color:'#bfcdd8',fontSize:13}}>Sem consultas ou avaliações registradas.</div>

  const allFields = getAllFormFields(p.esp)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:7}}>
      {timeline.map((entry, idx) => {
        if (entry._type === 'avaliacao') {
          const isExp = expanded === entry.id
          return (
            <div key={entry.id} style={{borderRadius:10,border:'2px solid #cce9f5',overflow:'hidden'}}>
              <HistItem onClick={()=>setExpanded(isExp?null:entry.id)} style={{cursor:'pointer',background: isExp?'#eaf5fb':'#fff',marginBottom:0,border:'none',borderRadius:0}}>
                <div style={{width:9,height:9,borderRadius:'50%',background:color,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#2e5f7a'}}>
                    📋 Avaliação realizada — {entry.time}
                  </div>
                  <div style={{fontSize:11,color:'#9aaebb'}}>{fmtDate(entry.date)} · {entry.prof||p.prof}</div>
                </div>
                <Badge $bg='#cce9f5' $color='#2e5f7a'>Avaliação</Badge>
                <span style={{fontSize:11,color:'#9aaebb',marginLeft:6}}>{isExp?'▲':'▼'}</span>
              </HistItem>
              {isExp && (
                <div style={{padding:'14px 18px',background:'#f5f8fa',borderTop:'1px solid #e2eaef'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
                    {allFields.map(f => {
                      const v = entry.fields?.[f.id]
                      if (!v && v !== 0) return null
                      return (
                        <div key={f.id} style={{background:'#fff',borderRadius:8,padding:'8px 12px',border:'1px solid #e8f0f5'}}>
                          <div style={{fontSize:9.5,color:'#9aaebb',fontWeight:700,textTransform:'uppercase',letterSpacing:'.4px',marginBottom:3}}>{f.label}</div>
                          <div style={{fontSize:13,fontWeight:600,color:'#2e5f7a'}}>{String(v)}</div>
                        </div>
                      )
                    })}
                  </div>
                  {entry.anotacoes && (
                    <div style={{background:'#fff',borderRadius:8,padding:'10px 12px',border:'1px solid #e8f0f5'}}>
                      <div style={{fontSize:9.5,color:'#9aaebb',fontWeight:700,textTransform:'uppercase',letterSpacing:'.4px',marginBottom:4}}>Anotações do Profissional</div>
                      <div style={{fontSize:12.5,color:'#587080',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{entry.anotacoes}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        }
        // consulta
        return (
          <HistItem key={entry.id||idx}>
            <div style={{fontSize:12,fontWeight:700,color:'#587080',minWidth:42}}>{entry.time}</div>
            <div style={{width:9,height:9,borderRadius:'50%',background:color,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{fmtDate(entry.date)}</div>
              <div style={{fontSize:11,color:'#9aaebb'}}>{entry.obs||'Consulta'} · {entry.sala||''}</div>
            </div>
            <Badge $bg={entry.status==='confirmed'?'#cce9f5':'#fde8c2'} $color={entry.status==='confirmed'?'#2e5f7a':'#a6670e'}>
              {entry.status==='confirmed'?'Confirmada':'Pendente'}
            </Badge>
          </HistItem>
        )
      })}
    </div>
  )
}

function TabDocumentos() {
  return (
    <div style={{textAlign:'center',padding:40,color:'#bfcdd8',fontSize:13}}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{margin:'0 auto 12px',display:'block'}}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#d1dde6" strokeWidth="1.4"/>
        <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#d1dde6" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      Nenhum documento emitido ainda.
      <div style={{marginTop:12,display:'flex',gap:8,justifyContent:'center'}}>
        <button style={{padding:'6px 14px',borderRadius:8,border:'1px solid #d1dde6',background:'#fff',color:'#587080',cursor:'pointer',fontSize:12}}>+ Receita</button>
        <button style={{padding:'6px 14px',borderRadius:8,border:'1px solid #d1dde6',background:'#fff',color:'#587080',cursor:'pointer',fontSize:12}}>+ Atestado</button>
      </div>
    </div>
  )
}

// ── Controlled field input ────────────────────────────────
function FieldInputCtrl({ f, value, onChange }) {
  if (f.type==='range') return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:11}}>
        <input type="range" min={f.min} max={f.max} value={value??Math.round((f.min+f.max)/2)}
          onChange={e=>onChange(e.target.value)} style={{flex:1,accentColor:'#2e9ac4'}}/>
        <span style={{fontSize:13,fontWeight:700,color:'#2e9ac4',minWidth:22}}>{value??Math.round((f.min+f.max)/2)}</span>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:9.5,color:'#bfcdd8',marginTop:2}}>
        <span>{f.min}</span><span>{f.max}</span>
      </div>
    </div>
  )
  if (f.type==='select') return (
    <Select value={value||''} onChange={e=>onChange(e.target.value)}>
      <option value="">Selecione…</option>
      {f.opts.map(o=><option key={o}>{o}</option>)}
    </Select>
  )
  if (f.type==='textarea') return (
    <Textarea rows={3} placeholder={f.ph||''} value={value||''} onChange={e=>onChange(e.target.value)}/>
  )
  return <Input type={f.type||'text'} placeholder={f.ph||''} value={value||''} onChange={e=>onChange(e.target.value)}/>
}

function FormSection({ title, color='#9aaebb', children }) {
  return (
    <div style={{background:'#f5f8fa',borderRadius:14,padding:18,border:'1px solid #e8f0f5',marginBottom:16}}>
      <div style={{fontSize:9.5,fontWeight:700,color,textTransform:'uppercase',letterSpacing:'.7px',marginBottom:14}}>{title}</div>
      {children}
    </div>
  )
}

function TabFormulario({ p, onSave }) {
  const fd = FORMULARIO[p.esp] || FORMULARIO.Fisioterapia

  const initVals = () => {
    const v = {}
    const flatten = arr => arr?.forEach(f => { v[f.id] = f.type==='range' ? Math.round((f.min+f.max)/2) : '' })
    flatten(fd.indicadores)
    flatten(fd.medidas)
    flatten(fd.relatorio)
    // per-body-part for Fisioterapia
    if (p.esp === 'Fisioterapia') {
      FORM_PARTES.forEach(pt => {
        v[pt.id+'_status'] = 'bom'
        v[pt.id+'_score']  = ''
        v[pt.id+'_desc']   = ''
      })
    }
    return v
  }
  const [vals, setVals] = useState(initVals)
  const [anotacoes, setAnotacoes] = useState('')
  const [saved, setSaved] = useState(false)
  const setV = (id, val) => setVals(v => ({...v, [id]: val}))

  const handleSave = () => {
    onSave({
      id: Date.now(),
      date: new Date().toISOString().slice(0,10),
      time: new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
      esp: p.esp, prof: p.prof,
      fields: { ...vals },
      anotacoes,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Header = () => (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
      <div>
        <div style={{fontSize:14,fontWeight:700}}>Ficha de Avaliação — {p.esp}</div>
        <div style={{fontSize:11.5,color:'#9aaebb',marginTop:2}}>
          {new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})}
        </div>
      </div>
      <button onClick={handleSave} style={{
        padding:'8px 20px',borderRadius:8,border:'none',
        background:saved?'#2e8c6e':'#2e9ac4',
        color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer',transition:'background .3s',
      }}>
        {saved ? '✓ Avaliação salva!' : 'Salvar avaliação'}
      </button>
    </div>
  )

  const FieldsGrid = ({ fields, cols=2 }) => (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:10}}>
      {fields.map((f,i) => (
        <FG key={i} style={f.type==='textarea'||f.type==='range'?{gridColumn:'1/-1'}:{}}>
          <Lbl>{f.label}</Lbl>
          <FieldInputCtrl f={f} value={vals[f.id]} onChange={v=>setV(f.id,v)}/>
        </FG>
      ))}
    </div>
  )

  const Anotacoes = () => (
    <div style={{background:'#fff',borderRadius:14,padding:18,border:'1px solid #e2eaef'}}>
      <Lbl style={{fontSize:11,marginBottom:8}}>Anotações Gerais do Profissional</Lbl>
      <Textarea rows={4} placeholder="Observações clínicas adicionais, alertas, planos futuros…"
        value={anotacoes} onChange={e=>setAnotacoes(e.target.value)}/>
    </div>
  )

  if (p.esp === 'Fisioterapia') return (
    <div>
      <Header/>
      <FormSection title="Indicadores Clínicos" color="#2e9ac4">
        <FieldsGrid fields={fd.indicadores}/>
      </FormSection>
      <FormSection title="Avaliação por Segmento Corporal" color="#3a7a9c">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead>
            <tr style={{fontSize:9.5,color:'#bfcdd8'}}>
              <th style={{textAlign:'left',padding:'3px 6px',fontWeight:600}}>Segmento</th>
              <th style={{textAlign:'left',padding:'3px 6px',fontWeight:600}}>Status</th>
              <th style={{textAlign:'left',padding:'3px 6px',fontWeight:600}}>Score (0–100)</th>
              <th style={{textAlign:'left',padding:'3px 6px',fontWeight:600}}>Observação</th>
            </tr>
          </thead>
          <tbody>
            {FORM_PARTES.map(pt => (
              <tr key={pt.id} style={{borderTop:'1px solid #e8f0f5'}}>
                <td style={{padding:'6px',fontWeight:600,color:'#587080',whiteSpace:'nowrap'}}>{pt.label}</td>
                <td style={{padding:'4px 6px'}}>
                  <Select value={vals[pt.id+'_status']||'bom'} onChange={e=>setV(pt.id+'_status',e.target.value)} style={{fontSize:11.5}}>
                    <option value="bom">Bom</option>
                    <option value="atencao">Atenção</option>
                    <option value="em_tratamento">Em tratamento</option>
                  </Select>
                </td>
                <td style={{padding:'4px 6px'}}>
                  <Input type="number" min={0} max={100} placeholder="80"
                    value={vals[pt.id+'_score']||''} onChange={e=>setV(pt.id+'_score',e.target.value)}
                    style={{fontSize:11.5}}/>
                </td>
                <td style={{padding:'4px 6px'}}>
                  <Input type="text" placeholder="Observação breve…"
                    value={vals[pt.id+'_desc']||''} onChange={e=>setV(pt.id+'_desc',e.target.value)}
                    style={{fontSize:11.5}}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormSection>
      <FormSection title="Relatório da Sessão" color="#587080">
        <FieldsGrid fields={fd.relatorio} cols={1}/>
      </FormSection>
      <Anotacoes/>
    </div>
  )

  if (p.esp === 'Nutrição') return (
    <div>
      <Header/>
      <FormSection title="Medidas Antropométricas e InBody" color="#c8821a">
        <FieldsGrid fields={fd.medidas} cols={3}/>
      </FormSection>
      <FormSection title="Relatório da Sessão" color="#587080">
        <FieldsGrid fields={fd.relatorio} cols={1}/>
      </FormSection>
      <Anotacoes/>
    </div>
  )

  // Psicologia
  return (
    <div>
      <Header/>
      <FormSection title="Indicadores Clínicos" color="#2e5f7a">
        <FieldsGrid fields={fd.indicadores}/>
      </FormSection>
      <FormSection title="Relatório da Sessão" color="#587080">
        <FieldsGrid fields={fd.relatorio} cols={1}/>
      </FormSection>
      <Anotacoes/>
    </div>
  )
}

// ── InBody data (Nutrição) ───────────────────────────────
const INBODY = {
  score: 79,
  composicao: [
    { label:'Água Corporal Total', unit:'L',  val:36.3, lo:33.3, hi:40.7, desc:'Para a construção de músculos' },
    { label:'Proteína',            unit:'kg', val:9.9,  lo:8.9,  hi:10.9, desc:'Para a construção de músculos' },
    { label:'Minerais',            unit:'kg', val:3.20, lo:3.08, hi:3.76, desc:'Para fortalecer os ossos' },
    { label:'Massa de Gordura',    unit:'kg', val:8.8,  lo:7.1,  hi:14.2, desc:'Para armazenar energia extra' },
    { label:'Peso',                unit:'kg', val:58.2, lo:50.3, hi:68.0, desc:'A soma acima' },
  ],
  muscGord: [
    { label:'Peso',              val:58.2, normal:[50.3,68.0], max:90 },
    { label:'Massa Muscular',    val:27.9, normal:[24.0,30.0], max:55 },
    { label:'Massa de Gordura',  val:8.8,  normal:[7.1,14.2],  max:30 },
  ],
  obesidade: [
    { label:'IMC',  val:21.6, unit:'kg/m²', lo:18.5, hi:25.0, absMax:45 },
    { label:'PGC',  val:15.1, unit:'%',     lo:10.0, hi:20.0, absMax:45 },
  ],
  controle: [
    { label:'Peso ideal',          val:'59,2 kg' },
    { label:'Controle de peso',    val:'+1,0 kg', color:'#2e9ac4' },
    { label:'Controle de gordura', val:'+0,1 kg', color:'#2e9ac4' },
    { label:'Controle muscular',   val:'+0,9 kg', color:'#2e9ac4' },
  ],
  segmentos: [
    { label:'Braço E', muscle:'2,91 kg', musclePct:109, fat:'0,3 kg', fatPct:65  },
    { label:'Braço D', muscle:'2,80 kg', musclePct:108, fat:'0,4 kg', fatPct:68  },
    { label:'Tronco',  muscle:'23,2 kg', musclePct:106, fat:'4,2 kg', fatPct:111 },
    { label:'Perna E', muscle:'7,21 kg', musclePct:90,  fat:'1,4 kg', fatPct:93  },
    { label:'Perna D', muscle:'7,11 kg', musclePct:90,  fat:'1,4 kg', fatPct:93  },
  ],
  historico: [
    { date:'Out', peso:60.1, musculo:26.7, gord:15.5 },
    { date:'Nov', peso:60.6, musculo:28.7, gord:16.4 },
    { date:'Dez', peso:61.3, musculo:29.2, gord:16.1 },
    { date:'Jan', peso:61.0, musculo:29.3, gord:15.4 },
    { date:'Fev', peso:59.5, musculo:27.9, gord:17.0 },
    { date:'Mar', peso:58.2, musculo:27.5, gord:15.9 },
  ],
}

function RangeBar({ val, lo, hi, absMax }) {
  const pct = v => Math.min(100, Math.max(0, (v / absMax) * 100))
  const loPct = pct(lo), hiPct = pct(hi), valPct = pct(val)
  const inRange = val >= lo && val <= hi
  const col = inRange ? '#2e9ac4' : '#e05858'
  return (
    <div style={{position:'relative',height:10,background:'#e8f0f5',borderRadius:5,margin:'5px 0',overflow:'visible'}}>
      <div style={{position:'absolute',left:loPct+'%',width:(hiPct-loPct)+'%',top:0,bottom:0,background:'#c5dff0',borderRadius:5}}/>
      <div style={{
        position:'absolute', left:`calc(${valPct}% - 7px)`, top:-4,
        width:18, height:18, borderRadius:'50%',
        background:'#fff', border:`3px solid ${col}`,
        boxShadow:`0 1px 5px rgba(0,0,0,.18)`,
      }}/>
    </div>
  )
}

function TabResultadosNutricao({ avaliacoes }) {
  const latestEval = avaliacoes?.[0]
  const lf = latestEval?.fields || {}
  const hasEval = !!latestEval

  const n = (key, fallback) => parseFloat(lf[key]) || fallback
  const peso    = n('peso',    INBODY.composicao.find(c=>c.label==='Peso')?.val)
  const musculo = n('musculo', INBODY.muscGord.find(m=>m.label==='Massa Muscular')?.val)
  const gordura = n('gordura', INBODY.muscGord.find(m=>m.label==='Massa de Gordura')?.val)
  const agua    = n('agua',    INBODY.composicao.find(c=>c.label==='Água Corporal Total')?.val)
  const proteina= n('proteina',INBODY.composicao.find(c=>c.label==='Proteína')?.val)
  const minerais= n('minerais',INBODY.composicao.find(c=>c.label==='Minerais')?.val)
  const imc     = n('imc',     INBODY.obesidade.find(o=>o.label==='IMC')?.val)
  const pgc     = n('pgc',     INBODY.obesidade.find(o=>o.label==='PGC')?.val)
  const score   = n('score',   INBODY.score)

  const d = {
    score,
    composicao: [
      { label:'Água Corporal Total', unit:'L',  val:agua,    lo:33.3, hi:40.7 },
      { label:'Proteína',            unit:'kg', val:proteina, lo:8.9,  hi:10.9 },
      { label:'Minerais',            unit:'kg', val:minerais, lo:3.08, hi:3.76 },
      { label:'Massa de Gordura',    unit:'kg', val:gordura,  lo:7.1,  hi:14.2 },
      { label:'Peso',                unit:'kg', val:peso,     lo:50.3, hi:68.0 },
    ],
    muscGord: [
      { label:'Peso',             val:peso,    normal:[50.3,68.0], max:90 },
      { label:'Massa Muscular',   val:musculo, normal:[24.0,30.0], max:55 },
      { label:'Massa de Gordura', val:gordura, normal:[7.1,14.2],  max:30 },
    ],
    obesidade: [
      { label:'IMC', val:imc, unit:'kg/m²', lo:18.5, hi:25.0, absMax:45 },
      { label:'PGC', val:pgc, unit:'%',     lo:10.0, hi:20.0, absMax:45 },
    ],
    controle: INBODY.controle,
    segmentos: INBODY.segmentos,
    historico: hasEval
      ? [...avaliacoes].reverse().map(av => ({
          date:   fmtDate(av.date).slice(0,5),
          peso:   parseFloat(av.fields?.peso)    || peso,
          musculo:parseFloat(av.fields?.musculo) || musculo,
          gord:   parseFloat(av.fields?.gordura) || gordura,
        }))
      : INBODY.historico,
  }
  return (
    <div style={{fontSize:12.5}}>
      {/* Top row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 200px',gap:20,marginBottom:20}}>
        {/* Composição corporal */}
        <div>
          <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:10}}>Análise da Composição Corporal</div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:11.5}}>
            <thead>
              <tr style={{fontSize:9.5,color:'#bfcdd8'}}>
                <th style={{textAlign:'left',padding:'3px 0',fontWeight:600}}>Componente</th>
                <th style={{textAlign:'right',padding:'3px 8px',fontWeight:600}}>Valor</th>
                <th style={{textAlign:'center',padding:'3px 0',fontWeight:600,width:130}}>Abaixo — Normal — Acima</th>
              </tr>
            </thead>
            <tbody>
              {d.composicao.map((c,i) => (
                <tr key={i} style={{borderTop:'1px solid #f0f5f8'}}>
                  <td style={{padding:'4px 0',color:'#587080'}}>{c.label}</td>
                  <td style={{padding:'4px 8px',textAlign:'right',fontWeight:700,color:'#2e5f7a',whiteSpace:'nowrap'}}>
                    {c.val} <span style={{fontWeight:400,color:'#9aaebb',fontSize:9.5}}>{c.unit}</span>
                  </td>
                  <td style={{padding:'4px 0'}}>
                    <RangeBar val={c.val} lo={c.lo} hi={c.hi} absMax={c.hi*1.45}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* InBody score */}
        <div style={{background:'#f5f8fa',borderRadius:14,padding:16,border:'1px solid #e2eaef',textAlign:'center'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:12}}>Pontuação InBody</div>
          <svg viewBox="0 0 100 82" style={{width:130,display:'block',margin:'0 auto'}}>
            <path d="M 10 65 A 40 40 0 0 1 90 65" fill="none" stroke="#e2eaef" strokeWidth="8" strokeLinecap="round"/>
            <path d="M 10 65 A 40 40 0 0 1 90 65" fill="none" stroke="#2e9ac4" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${d.score*1.257} 200`}/>
            <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="800" fill="#2e5f7a">{d.score}</text>
            <text x="50" y="74" textAnchor="middle" fontSize="9" fill="#9aaebb">/100 Pontos</text>
          </svg>
          <div style={{fontSize:10.5,color:'#7a90a0',lineHeight:1.6,marginTop:8}}>
            Pontuação total que reflete a composição corporal.
          </div>
          <div style={{marginTop:14,textAlign:'left'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:8}}>Controle de Peso</div>
            {d.controle.map((c,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'3px 0',borderTop:i?'1px solid #f0f5f8':'none',fontSize:11}}>
                <span style={{color:'#7a90a0'}}>{c.label}</span>
                <span style={{fontWeight:700,color:c.color||'#2e5f7a'}}>{c.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Músculo-Gordura + Obesidade */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
        <div style={{background:'#f5f8fa',borderRadius:12,padding:14,border:'1px solid #e2eaef'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:12}}>Análise Músculo-Gordura</div>
          {d.muscGord.map((r,i) => (
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11.5,marginBottom:3}}>
                <span style={{color:'#587080'}}>{r.label}</span>
                <span style={{fontWeight:700,color:'#2e5f7a'}}>{r.val} kg</span>
              </div>
              <RangeBar val={r.val} lo={r.normal[0]} hi={r.normal[1]} absMax={r.max}/>
            </div>
          ))}
        </div>
        <div style={{background:'#f5f8fa',borderRadius:12,padding:14,border:'1px solid #e2eaef'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:12}}>Análise de Obesidade</div>
          {d.obesidade.map((r,i) => (
            <div key={i} style={{marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11.5,marginBottom:3}}>
                <span style={{color:'#587080'}}>{r.label}</span>
                <span style={{fontWeight:700,color:'#2e5f7a'}}>{r.val} <span style={{fontWeight:400,color:'#9aaebb',fontSize:10}}>{r.unit}</span></span>
              </div>
              <RangeBar val={r.val} lo={r.lo} hi={r.hi} absMax={r.absMax}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:9.5,color:'#bfcdd8',marginTop:2}}>
                <span>Abaixo</span><span>Normal</span><span>Acima</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segmental + Histórico */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div style={{background:'#f5f8fa',borderRadius:12,padding:14,border:'1px solid #e2eaef'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:10}}>Análise Segmentar</div>
          {(() => {
            const segs = d.segmentos
            const [bracoE, bracoD, tronco, pernaE, pernaD] = segs
            const gc = pct => pct >= 100 ? '#2e9ac4' : pct >= 90 ? '#c8821a' : '#e05858'
            const Card = ({ s, align='left' }) => (
              <div style={{background:'#fff',borderRadius:8,padding:'6px 9px',border:'1px solid #e2eaef',textAlign:align,lineHeight:1.3}}>
                <div style={{fontSize:9,color:'#9aaebb',fontWeight:600,marginBottom:1}}>{s.label}</div>
                <div style={{fontSize:11.5,fontWeight:700,color:'#2e5f7a'}}>{s.muscle}</div>
                <div style={{fontSize:9.5,fontWeight:700,color:gc(s.musclePct)}}>{s.musclePct}%</div>
                <div style={{fontSize:8.5,color:'#bfcdd8',marginTop:2,borderTop:'1px solid #f0f5f8',paddingTop:2}}>
                  Gord: {s.fat} <span style={{fontWeight:700,color:gc(s.fatPct<=100?101:89)}}>{s.fatPct}%</span>
                </div>
              </div>
            )
            return (
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                {/* Left: Braço E + Tronco + Perna E */}
                <div style={{display:'flex',flexDirection:'column',gap:3,flex:1,paddingTop:10,paddingBottom:10}}>
                  <Card s={{...bracoE,label:'Braço E'}} align='right'/>
                  <div style={{flex:1}}/>
                  <Card s={{...tronco,label:'Tronco'}} align='right'/>
                  <div style={{flex:1}}/>
                  <Card s={{...pernaE,label:'Perna E'}} align='right'/>
                </div>
                {/* Body image BIGGER */}
                <div style={{flex:'0 0 175px'}}>
                  <img src="/body.png" alt="" style={{
                    width:'100%',height:'auto',display:'block',
                    filter: BODY_FILTER,
                  }}/>
                </div>
                {/* Right: Braço D + legenda + Perna D */}
                <div style={{display:'flex',flexDirection:'column',gap:3,flex:1,paddingTop:10,paddingBottom:10}}>
                  <Card s={{...bracoD,label:'Braço D'}}/>
                  <div style={{flex:1}}/>
                  <div style={{textAlign:'center',padding:'5px 4px',background:'#f5f8fa',borderRadius:8,border:'1px solid #e2eaef'}}>
                    <div style={{fontSize:8.5,color:'#9aaebb',fontWeight:600,marginBottom:3}}>Massa Magra</div>
                    <div style={{fontSize:8.5,color:'#2e9ac4',fontWeight:700}}>≥100% ✓ bom</div>
                    <div style={{fontSize:8.5,color:'#c8821a',fontWeight:700}}>90-99% atenção</div>
                    <div style={{fontSize:8.5,color:'#e05858',fontWeight:700}}>&lt;90% abaixo</div>
                  </div>
                  <div style={{flex:1}}/>
                  <Card s={{...pernaD,label:'Perna D'}}/>
                </div>
              </div>
            )
          })()}
        </div>
        <div style={{background:'#f5f8fa',borderRadius:12,padding:14,border:'1px solid #e2eaef'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#9aaebb',textTransform:'uppercase',letterSpacing:'.7px',marginBottom:10}}>Histórico Corporal</div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
            <thead>
              <tr style={{fontSize:9.5,color:'#bfcdd8'}}>
                <th style={{textAlign:'left',padding:'3px 4px',fontWeight:600}}></th>
                {d.historico.map((h,i) => <th key={i} style={{textAlign:'center',padding:'3px 4px',fontWeight:600}}>{h.date}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                { label:'Peso (kg)',    key:'peso',    color:'#2e5f7a' },
                { label:'Músculo (kg)',  key:'musculo', color:'#2e9ac4' },
                { label:'Gordura (%)',   key:'gord',    color:'#c8821a' },
              ].map((row,i) => (
                <tr key={i} style={{borderTop:'1px solid #e8f0f5'}}>
                  <td style={{padding:'5px 4px',color:row.color,fontWeight:600,whiteSpace:'nowrap'}}>{row.label}</td>
                  {d.historico.map((h,j) => (
                    <td key={j} style={{textAlign:'center',padding:'5px 4px',fontWeight:j===d.historico.length-1?700:400,
                      color:j===d.historico.length-1?row.color:'#587080'}}>{h[row.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────
const ALL_TABS = [
  { key:'info',       label:'Dados Cadastrais' },
  { key:'anamnese',   label:'Anamnese' },
  { key:'resultados', label:'Resultados' },
  { key:'historico',  label:'Histórico de Consultas' },
  { key:'documentos', label:'Receitas & Atestados' },
  { key:'formulario', label:'Formulário de Avaliação' },
]
const PSI_TABS = [
  { key:'info',      label:'Dados Cadastrais' },
  { key:'historico', label:'Histórico de Consultas' },
]

export default function PatientProfile({ patient, onClose, onEdit }) {
  const p = patient
  const tabs = p.esp === 'Psicologia' ? PSI_TABS : ALL_TABS
  const [tab, setTab] = useState('info')
  const [avaliacoes, setAvaliacoes] = useState([])
  const handleSaveAvaliacao = (data) => {
    setAvaliacoes(v => [data, ...v])
    setTab('historico')
  }
  const espBadge  = ESP_BADGE[p.esp]  || { bg:'#edf1f5', color:'#587080' }
  const planoBadge = PLANO_BADGE[p.plano] || { bg:'#edf1f5', color:'#587080' }
  const freqBadge = FREQ_BADGE[p.freqPresc] || { bg:'#edf1f5', color:'#587080' }

  return (
    <Overlay>
      <Topbar>
        <BackBtn onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar para Pacientes
        </BackBtn>
        <div style={{fontSize:14,fontWeight:700,color:'#2e5f7a'}}>{p.nome}</div>
        <button onClick={onEdit} style={{padding:'6px 14px',borderRadius:8,border:'1px solid #2e9ac4',background:'#fff',color:'#2e9ac4',fontWeight:700,cursor:'pointer',fontSize:13}}>
          ✏ Editar
        </button>
      </Topbar>

      <Body>
        {/* Hero */}
        <Hero>
          <Av>{initials(p.nome)}</Av>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:22,fontWeight:700,letterSpacing:'-.4px',marginBottom:7}}>{p.nome}</div>
            <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:8}}>
              <Badge $bg={espBadge.bg} $color={espBadge.color}>{p.esp}</Badge>
              {p.plano && <Badge $bg={planoBadge.bg} $color={planoBadge.color}>{p.plano}</Badge>}
              {p.freqPresc && <Badge $bg={freqBadge.bg} $color={freqBadge.color}>{p.freqPresc}</Badge>}
            </div>
            <div style={{fontSize:13,color:'#9aaebb'}}>
              {p.prof || 'Sem profissional'} · Última consulta: {fmtDate(p.lastVisit)} ({daysSince(p.lastVisit)} dias)
            </div>
          </div>
          <StatGrid>
            <StatBox>
              <div style={{fontSize:22,fontWeight:700,color:'#2e9ac4',letterSpacing:'-.4px'}}>{p.visitCount||0}</div>
              <div style={{fontSize:11,color:'#9aaebb',marginTop:2}}>Consultas</div>
            </StatBox>
            <StatBox>
              <div style={{fontSize:22,fontWeight:700,letterSpacing:'-.4px'}}>{p.peso||'—'}</div>
              <div style={{fontSize:11,color:'#9aaebb',marginTop:2}}>Peso</div>
            </StatBox>
            <StatBox>
              <div style={{fontSize:22,fontWeight:700,letterSpacing:'-.4px'}}>{p.sangue||'—'}</div>
              <div style={{fontSize:11,color:'#9aaebb',marginTop:2}}>Tipo sanguíneo</div>
            </StatBox>
            <StatBox>
              <div style={{fontSize:22,fontWeight:700,letterSpacing:'-.4px'}}>{age(p.nasc)}</div>
              <div style={{fontSize:11,color:'#9aaebb',marginTop:2}}>Idade</div>
            </StatBox>
          </StatGrid>
        </Hero>

        {/* Tabs */}
        <TabBar>
          {tabs.map(t => (
            <Tab key={t.key} $active={tab===t.key} onClick={() => setTab(t.key)}>{t.label}</Tab>
          ))}
        </TabBar>
        <TabBody>
          {tab==='info'       && <TabInfo        p={p}/>}
          {tab==='anamnese'   && <TabAnamnese    p={p}/>}
          {tab==='resultados' && <TabResultados  p={p} avaliacoes={avaliacoes}/>}
          {tab==='historico'  && <TabHistorico   p={p} avaliacoes={avaliacoes}/>}
          {tab==='documentos' && <TabDocumentos/>}
          {tab==='formulario' && <TabFormulario  p={p} onSave={handleSaveAvaliacao}/>}
        </TabBody>
      </Body>
    </Overlay>
  )
}
