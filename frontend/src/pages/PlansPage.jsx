import styled from 'styled-components'
import { PageHeader, PageTitle, PageSub, Card } from '../components/ui'

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 14px;
`

const PlanCard = styled(Card)`
  position: relative;
  border: ${({ $featured, $color }) => $featured ? `2px solid ${$color}` : '1px solid #dce4eb'};
  box-shadow: ${({ $featured, $color }) => $featured ? `0 0 0 3px ${$color}18, 0 4px 16px rgba(30,60,80,.09)` : undefined};
  padding-top: ${({ $hasTag }) => $hasTag ? '28px' : '20px'};
`

const PlanTag = styled.div`
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ color }) => color};
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 13px;
  border-radius: 20px;
  white-space: nowrap;
`

const PlanTier = styled.div`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: ${({ color }) => color};
  margin-bottom: 7px;
`

const PlanPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -1px;
  color: ${({ $featured, color }) => $featured ? color : '#253540'};
  span { font-size: 12.5px; color: #9aaebb; font-weight: 400; }
`

const PlanSub = styled.div`
  font-size: 10.5px;
  color: #7a90a0;
  margin: 4px 0 12px;
  line-height: 1.5;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #edf1f5;
  margin-bottom: 12px;
`

const Feature = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: ${({ $ok }) => $ok ? '#3d5060' : '#bfcdd8'};
  margin-bottom: 8px;
`

const Check = styled.div`
  width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
  background: ${({ $ok, color }) => $ok ? color + '18' : '#edf1f5'};
  display: flex; align-items: center; justify-content: center;
`

const SectionHeader = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px; margin-top: 28px;
`

const SectionIcon = styled.div`
  width: 32px; height: 32px; border-radius: 9px;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  display: flex; align-items: center; justify-content: center;
`

const PlanGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
`
const ComboBadges = styled.div`
  display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;
`
const ComboBadge = styled.span`
  font-size: 9.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
  background: ${({$bg}) => $bg}; color: ${({$color}) => $color};
`
const ComboDesc = styled.div`
  font-size: 11.5px; color: ${({$color}) => $color||'#587080'};
  background: ${({$bg}) => $bg}; border-radius: 8px;
  padding: 8px 12px; margin: 8px 0 12px; line-height: 1.5;
  border-left: 3px solid ${({$border}) => $border||'#2e9ac4'};
`
const ComboPrice = styled.div`
  font-size: 26px; font-weight: 800; letter-spacing: -1px;
  color: ${({$color}) => $color};
  span { font-size: 12px; font-weight: 400; color: #9aaebb; }
  margin-bottom: 12px;
`
const PlanName = styled.div`
  font-size: 15px; font-weight: 800; color: #253540; margin-bottom: 2px;
`
const PlanSubtitle = styled.div`
  font-size: 11px; color: #9aaebb; margin-bottom: 6px;
`

const ESP = {
  Fisioterapia: { bg:'#e8f5fa', color:'#2e9ac4' },
  Nutrição:     { bg:'#dceaf0', color:'#3a7a9c' },
  Psicologia:   { bg:'#e4eef4', color:'#2e5f7a' },
}

const COMBINADOS = [
  {
    nome:'Reabilitação Integrada', esps:['Fisioterapia','Nutrição'],
    sub:'Fisioterapia + Nutrição', tag:null,
    desc:'Ideal para recuperação pós-operatória e patologias crônicas que demandam suporte clínico e nutricional simultâneo.',
    price:'R$ 399', color:'#2e9ac4', descBg:'#eaf5fb', descBorder:'#2e9ac4',
    fts:['Premium Fisioterapia incluso (4 sessões)','Premium Nutrição incluso (2 consultas)','Bioimpedância mensal inclusa','Relatório multidisciplinar mensal','Desconto de 15% vs planos separados','Avaliação conjunta profissional-nutricionista','Recovery compressivo incluso'],
  },
  {
    nome:'Saúde Mental e Corpo', esps:['Fisioterapia','Psicologia'],
    sub:'Fisioterapia + Psicologia', tag:null,
    desc:'Para pacientes com dor crônica associada a quadros ansiosos ou depressivos, com abordagem simultânea do corpo e da mente.',
    price:'R$ 429', color:'#2e5f7a', descBg:'#eef3f7', descBorder:'#2e5f7a',
    fts:['Premium Fisioterapia incluso (4 sessões)','Premium Psicologia incluso (4 sessões)','Comunicação entre profissionais garantida','Relatório integrado bimestral','Desconto de 15% vs planos separados','Liberação miofascial inclusa','Psicoeducação sobre dor inclusa'],
  },
  {
    nome:'Longevidade e Bem-Estar', esps:['Nutrição','Psicologia'],
    sub:'Nutrição + Psicologia', tag:null,
    desc:'Para quem busca mudança e um nível de hábitos sustentável com suporte emocional e nutricional contínuo.',
    price:'R$ 399', color:'#3a7a9c', descBg:'#eaf2f6', descBorder:'#3a7a9c',
    fts:['Premium Nutrição incluso (2 consultas)','Premium Psicologia incluso (4 sessões)','Bioimpedância mensal inclusa','Trabalho conjunto de crenças alimentares','Desconto de 15% vs planos separados','Monitoramento de humor e hábitos (app)','Plano alimentar com lista de compras'],
  },
  {
    nome:'Clínica Completa', esps:['Fisioterapia','Nutrição','Psicologia'],
    sub:'Fisioterapia + Nutrição + Psicologia', tag:'Melhor valor',
    desc:'Acesso amplo às três especialidades com desconto máximo e gestão integrada do caso.',
    price:'R$ 649', color:'#c8821a', descBg:'#fef5e7', descBorder:'#c8821a',
    fts:['Premium das 3 especialidades incluso','20% de desconto vs planos separados','Prontuário unificado e integrado','Reunião multidisciplinar trimestral','Bioimpedância mensal inclusa','Recovery e liberação miofascial inclusos','Gerente de caso dedicado','Prioridade máxima de agendamento'],
  },
]

const PERFIS = [
  {
    nome:'Perfil Atleta e Alto Rendimento', tag:'Alto Rendimento', tagColor:'#c8821a',
    sub:'Para esportistas amadores, semiprofissionais e atletas de alto nível.',
    desc:'Para esportistas amadores, semiprofissionais e atletas de alto nível.',
    price:'R$ 549', color:'#2e9ac4', descBg:'#eaf5fb', descBorder:'#2e9ac4',
    fts:['Fisioterapia Esportiva (6 sessões/mês)','Nutrição Esportiva (2 consultas/mês)','Periodização nutricional com macros','Análise biomecânica do gesto esportivo','Recovery compressivo (ilimitado)','Dry Needling quando indicado','Bioimpedância quinzenal','Plano de suplementação incluso'],
  },
  {
    nome:'Perfil Controle de Peso', tag:'Programa', tagColor:'#2e5f7a',
    sub:'Para pacientes com sobrepeso, obesidade ou em pré/pós-bariátrico.',
    desc:'Para pacientes com sobrepeso, obesidade ou em pré/pós-bariátrico.',
    price:'R$ 479', color:'#3a7a9c', descBg:'#eaf2f6', descBorder:'#3a7a9c',
    fts:['Nutrição Clínica Funcional (2 consultas)','Bioimpedância vetorial/mensal','Fisioterapia postural e mobilidade','Psicologia — comportamental alimentar','Monitoramento por aplicativo','Livro de receitas personalizado','Treino de habilidades DBT incluso','Orientação comportamental integrada'],
  },
  {
    nome:'Perfil Dor Crônica', tag:null, tagColor:null,
    sub:'Para pacientes com dor lombar, cervical, fibromialgia ou neuropatias.',
    desc:'Para pacientes com dor lombar, cervical, fibromialgia ou neuropatias.',
    price:'R$ 459', color:'#e05858', descBg:'#fef0f0', descBorder:'#e05858',
    fts:['Fisioterapia Ortopédica (6 sessões/mês)','Terapia Manual articular inclusa','Dry Needling quando indicado','TENS e ultrassom terapêutico inclusos','Psicologia — psicoeducação sobre dor','Relatório integrado bimestral','Eletroterapia ilimitada','Acupuntura quando indicada'],
  },
  {
    nome:'Perfil Saúde Preventiva', tag:null, tagColor:null,
    sub:'Para adultos saudáveis que buscam manter qualidade de vida e longevidade.',
    desc:'Para adultos saudáveis que buscam manter qualidade de vida e longevidade.',
    price:'R$ 349', color:'#2e9ac4', descBg:'#eaf5fb', descBorder:'#2e9ac4',
    fts:['Pilates Clínico (2x/semana)','Nutrição preventiva (1 consulta/mês)','Bioimpedância trimestral','RPG — Reeducação Postural Global','Recovery compressivo mensal','Avaliação postural semestral','Mindfulness Clínico incluso'],
  },
]

const AREAS = [
  {
    nome:'Fisioterapia', color:'#2e9ac4', bg:'#e8f5fa',
    tiers:[
      { nm:'Básico', price:'Avulso', period:'', featured:false, sub:'Sem mensalidade · pague por sessão',
        fts:[{t:'Fisioterapia Ortopédica',ok:true},{t:'Avaliação fisioterapêutica',ok:true},{t:'Agendamento online',ok:true},{t:'Eletroterapia (TENS / Ultrassom)',ok:false},{t:'Liberação miofascial',ok:false},{t:'Pilates Clínico incluso',ok:false}]},
      { nm:'Premium', price:'R$ 229', period:'/mês', featured:true, tag:'Mais escolhido', sub:'4 sessões mensais inclusas',
        fts:[{t:'Tudo do Básico',ok:true},{t:'10% desconto em avulsas',ok:true},{t:'Eletroterapia inclusa',ok:true},{t:'Liberação miofascial inclusa',ok:true},{t:'Recovery compressivo incluso',ok:true},{t:'Pilates Clínico incluso',ok:false}]},
      { nm:'Fidelidade', price:'R$ 389', period:'/mês', featured:false, sub:'8 sessões + recursos completos',
        fts:[{t:'Tudo do Premium',ok:true},{t:'15% desconto em avulsas',ok:true},{t:'RPG incluso',ok:true},{t:'Pilates Clínico 2x/semana',ok:true},{t:'Dry Needling incluso',ok:true},{t:'Avaliação biomecânica trimestral',ok:true}]},
    ]
  },
  {
    nome:'Nutrição', color:'#3a7a9c', bg:'#dceaf0',
    tiers:[
      { nm:'Básico', price:'Avulso', period:'', featured:false, sub:'Sem mensalidade · pague por consulta',
        fts:[{t:'Consulta nutricional',ok:true},{t:'Plano alimentar inicial',ok:true},{t:'Bioimpedância vetorial',ok:false},{t:'Monitoramento por app',ok:false},{t:'Suporte por mensagem',ok:false},{t:'Livro de receitas',ok:false}]},
      { nm:'Premium', price:'R$ 199', period:'/mês', featured:true, tag:'Mais escolhido', sub:'2 consultas + bioimpedância mensal',
        fts:[{t:'Tudo do Básico',ok:true},{t:'10% desconto em avulsas',ok:true},{t:'Bioimpedância mensal',ok:true},{t:'Monitoramento por app',ok:true},{t:'Plano com lista de compras',ok:true},{t:'Livro de receitas',ok:false}]},
      { nm:'Fidelidade', price:'R$ 349', period:'/mês', featured:false, sub:'Acompanhamento completo',
        fts:[{t:'Tudo do Premium',ok:true},{t:'15% desconto em avulsas',ok:true},{t:'Suporte por mensagem',ok:true},{t:'Livro de receitas personalizado',ok:true},{t:'Relatório de exames laboratoriais',ok:true},{t:'Plano de suplementação',ok:true}]},
    ]
  },
  {
    nome:'Psicologia', color:'#2e5f7a', bg:'#e4eef4',
    tiers:[
      { nm:'Básico', price:'Avulso', period:'', featured:false, sub:'Sem mensalidade · pague por sessão',
        fts:[{t:'Psicoterapia individual',ok:true},{t:'Triagem inicial',ok:true},{t:'Grupos terapêuticos',ok:false},{t:'Sessão de crise',ok:false},{t:'Treino DBT',ok:false},{t:'Mindfulness incluso',ok:false}]},
      { nm:'Premium', price:'R$ 249', period:'/mês', featured:true, tag:'Mais escolhido', sub:'4 sessões mensais inclusas',
        fts:[{t:'Tudo do Básico',ok:true},{t:'10% desconto em avulsas',ok:true},{t:'Grupos terapêuticos',ok:true},{t:'Relatório bimestral',ok:true},{t:'Monitoramento de humor',ok:true},{t:'Sessão de crise',ok:false}]},
      { nm:'Fidelidade', price:'R$ 419', period:'/mês', featured:false, sub:'Suporte terapêutico ampliado',
        fts:[{t:'Tudo do Premium',ok:true},{t:'15% desconto em avulsas',ok:true},{t:'1 sessão de crise/mês',ok:true},{t:'Treino DBT incluso',ok:true},{t:'Mindfulness Clínico',ok:true},{t:'Suporte entre sessões',ok:true}]},
    ]
  },
]

function CheckIcon({ ok, color }) {
  return (
    <Check $ok={ok} color={color}>
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M1.5 4.5l2 2 4-4" stroke={ok ? color : '#9aaebb'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Check>
  )
}

function ComboCard({ p }) {
  return (
    <PlanCard $featured={!!p.tag} $color={p.color} $hasTag={!!p.tag} style={{position:'relative'}}>
      {p.tag && <PlanTag color={p.tagColor||p.color}>{p.tag}</PlanTag>}
      {p.esps?.length > 0 && (
        <ComboBadges>
          {p.esps.map(e => (
            <ComboBadge key={e} $bg={ESP[e]?.bg} $color={ESP[e]?.color}>{e}</ComboBadge>
          ))}
        </ComboBadges>
      )}
      <PlanName>{p.nome}</PlanName>
      <PlanSubtitle>{p.sub}</PlanSubtitle>
      <ComboDesc $bg={p.descBg} $border={p.descBorder} $color="#587080">{p.desc}</ComboDesc>
      <ComboPrice $color={p.color}>{p.price}<span>/mês</span></ComboPrice>
      <Divider/>
      {p.fts.map(f => (
        <Feature key={f} $ok>
          <CheckIcon ok color={p.color}/>
          {f}
        </Feature>
      ))}
    </PlanCard>
  )
}

export default function PlansPage() {
  return (
    <div>
      <PageHeader><div><PageTitle>Planos & Descontos</PageTitle><PageSub>Planos por especialidade para cada perfil de paciente</PageSub></div></PageHeader>

      {/* ── Planos Combinados ── */}
      <SectionHeader>
        <SectionIcon bg="#fef3e2" color="#c8821a">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </SectionIcon>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:'#253540'}}>Planos Combinados — por Modalidade</div>
          <div style={{fontSize:11,color:'#9aaebb'}}>Combinações de especialidades com desconto integrado</div>
        </div>
      </SectionHeader>
      <PlanGrid2>
        {COMBINADOS.map(p => <ComboCard key={p.nome} p={p}/>)}
      </PlanGrid2>

      {/* ── Planos por Perfil ── */}
      <SectionHeader>
        <SectionIcon bg="#e8f5fa" color="#2e9ac4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        </SectionIcon>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:'#253540'}}>Planos por Perfil de Paciente</div>
          <div style={{fontSize:11,color:'#9aaebb'}}>Programas multidisciplinares desenhados para necessidades específicas</div>
        </div>
      </SectionHeader>
      <PlanGrid2>
        {PERFIS.map(p => <ComboCard key={p.nome} p={p}/>)}
      </PlanGrid2>

      {/* ── Planos por Especialidade ── */}
      <SectionHeader style={{marginTop:36}}>
        <SectionIcon bg="#e4eef4" color="#2e5f7a">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </SectionIcon>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:'#253540'}}>Planos por Especialidade</div>
          <div style={{fontSize:11,color:'#9aaebb'}}>Planos individuais Básico, Premium e Fidelidade</div>
        </div>
      </SectionHeader>
      {AREAS.map(area => (
        <div key={area.nome}>
          <SectionHeader>
            <SectionIcon bg={area.bg} color={area.color}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/><path d="M5 7.5c0-1.657 1.343-3 3-3s3 1.343 3 3v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M4 11h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </SectionIcon>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:'#253540'}}>{area.nome}</div>
            </div>
          </SectionHeader>
          <PlanGrid>
            {area.tiers.map(t => (
              <PlanCard key={t.nm} $featured={t.featured} $color={area.color} $hasTag={!!t.tag}>
                {t.tag && <PlanTag color={area.color}>{t.tag}</PlanTag>}
                <PlanTier color={area.color}>{t.nm}</PlanTier>
                <PlanPrice $featured={t.featured} color={area.color}>
                  {t.price}<span>{t.period}</span>
                </PlanPrice>
                <PlanSub>{t.sub}</PlanSub>
                <Divider/>
                {t.fts.map(f => (
                  <Feature key={f.t} $ok={f.ok}>
                    <CheckIcon ok={f.ok} color={area.color}/>
                    {f.t}
                  </Feature>
                ))}
              </PlanCard>
            ))}
          </PlanGrid>
        </div>
      ))}
    </div>
  )
}
