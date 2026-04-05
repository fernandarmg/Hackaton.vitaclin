// ServicesPage.jsx
import styled from 'styled-components'
import { PageHeader, PageTitle, PageSub, Card } from '../components/ui'

const AreaSection = styled.div` margin-bottom: 32px; `

const AreaHeader = styled.div`
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 14px; padding-bottom: 12px;
  border-bottom: 2px solid ${({ color }) => color + '30'};
`

const AreaBar = styled.div`
  width: 10px; height: 36px; border-radius: 3px;
  background: ${({ color }) => color};
`

const SvcGrid = styled.div`
  display: grid; grid-template-columns: repeat(3,1fr); gap: 12px;
`

const SvcCard = styled(Card)`
  position: relative;
  padding-left: 20px;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: ${({ color }) => color};
    border-radius: 3px 0 0 3px;
  }
`

const AREAS = [
  {
    nome: 'Fisioterapia', color: '#2e9ac4',
    svcs: [
      { nome:'Avaliação Fisioterapêutica', dur:'60 min', valor:'R$ 140', comissao:'40%' },
      { nome:'Fisioterapia Ortopédica',    dur:'50 min', valor:'R$ 180', comissao:'40%' },
      { nome:'Ultrassom Terapêutico',      dur:'30 min', valor:'R$ 110', comissao:'38%' },
      { nome:'Liberação Miofascial',       dur:'45 min', valor:'R$ 160', comissao:'42%' },
      { nome:'Dry Needling',               dur:'40 min', valor:'R$ 175', comissao:'44%', tag:'Especializado' },
      { nome:'RPG — Reeducação Postural',  dur:'60 min', valor:'R$ 185', comissao:'42%' },
      { nome:'Fisioterapia Esportiva',     dur:'55 min', valor:'R$ 195', comissao:'44%', tag:'Alto rendimento' },
      { nome:'Recovery Compressivo',       dur:'30 min', valor:'R$ 90',  comissao:'35%' },
      { nome:'Pilates Clínico',            dur:'55 min', valor:'R$ 170', comissao:'40%' },
    ]
  },
  {
    nome: 'Nutrição', color: '#3a7a9c',
    svcs: [
      { nome:'Consulta Nutricional',         dur:'50 min', valor:'R$ 160', comissao:'40%' },
      { nome:'Bioimpedância Vetorial',        dur:'30 min', valor:'R$ 100', comissao:'38%' },
      { nome:'Nutrição Esportiva',            dur:'60 min', valor:'R$ 190', comissao:'44%', tag:'Alto rendimento' },
      { nome:'Nutrição Clínica Funcional',    dur:'55 min', valor:'R$ 180', comissao:'42%' },
      { nome:'Plano Alimentar Detalhado',     dur:'—',      valor:'R$ 130', comissao:'40%' },
      { nome:'Monitoramento por Aplicativo',  dur:'Mensal', valor:'R$ 80',  comissao:'35%' },
    ]
  },
  {
    nome: 'Psicologia', color: '#2e5f7a',
    svcs: [
      { nome:'Psicoterapia Individual (TCC)', dur:'50 min', valor:'R$ 200', comissao:'40%' },
      { nome:'Sessão de Crise',               dur:'50 min', valor:'R$ 220', comissao:'42%', tag:'Urgência' },
      { nome:'Grupo Terapêutico',             dur:'75 min', valor:'R$ 90/p',comissao:'35%', tag:'Grupo' },
      { nome:'Treino de Habilidades (DBT)',   dur:'50 min', valor:'R$ 200', comissao:'40%' },
      { nome:'Mindfulness Clínico',           dur:'60 min', valor:'R$ 120', comissao:'38%', tag:'Programa' },
    ]
  },
]

export default function ServicesPage() {
  return (
    <div>
      <PageHeader><div><PageTitle>Serviços</PageTitle><PageSub>Catálogo de atendimentos · Valores e comissões</PageSub></div></PageHeader>
      {AREAS.map(area => (
        <AreaSection key={area.nome}>
          <AreaHeader color={area.color}>
            <AreaBar color={area.color}/>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:area.color}}>{area.nome}</div>
            </div>
          </AreaHeader>
          <SvcGrid>
            {area.svcs.map(s => (
              <SvcCard key={s.nome} color={area.color}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:6}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#253540',lineHeight:1.3,flex:1}}>{s.nome}</div>
                  {s.tag && <span style={{fontSize:9.5,fontWeight:700,padding:'2px 8px',borderRadius:20,background:'#e8f5fa',color:'#2e5f7a',marginLeft:6,flexShrink:0}}>{s.tag}</span>}
                </div>
                <div style={{borderTop:'1px solid #edf1f5',paddingTop:10,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:6}}>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{fontSize:15,fontWeight:700,color:area.color}}>{s.valor}</span>
                    <span style={{fontSize:10.5,color:'#7a90a0',background:'#edf1f5',padding:'2px 7px',borderRadius:20}}>{s.dur}</span>
                  </div>
                  <div style={{fontSize:10.5,color:'#7a90a0'}}>
                    <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:area.color,marginRight:4,opacity:.6}}/>
                    Comissão {s.comissao}
                  </div>
                </div>
              </SvcCard>
            ))}
          </SvcGrid>
        </AreaSection>
      ))}
    </div>
  )
}
