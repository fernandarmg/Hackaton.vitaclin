// ProfessionalsPage.jsx
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { getProfessionals, getPatients } from '../services/api'
import { PageHeader, PageTitle, PageSub, Badge, Card } from '../components/ui'
import ProfessionalProfile from './ProfessionalProfile'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
`

const PCard = styled(Card)`
  cursor: pointer;
  transition: all .2s;
  &:hover { box-shadow: ${({ theme }) => theme.shadows.md}; transform: translateY(-2px); }
`

const Av = styled.div`
  width: 46px; height: 46px; border-radius: 50%;
  background: ${({ theme }) => theme.colors.b5};
  color: ${({ theme }) => theme.colors.b1};
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 700; flex-shrink: 0;
`

const StatBox = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px;
`
const StatItem = styled.div`
  background: ${({ theme }) => theme.colors.g50};
  border-radius: 8px; padding: 9px 11px;
  border: 1px solid ${({ theme }) => theme.colors.g100};
`

const ESP_BADGE = { Fisioterapia:'sky', Nutrição:'teal', Psicologia:'purple' }
const initials = n => n?.trim().split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?'

export default function ProfessionalsPage() {
  const { isProfissional, profNome } = useAuth()
  const [profs, setProfs] = useState([])
  const [patientMap, setPatientMap] = useState({}) // nome → { count, consultas }
  const [selectedProf, setSelectedProf] = useState(null)

  const MOCK_PROFS = [
    {id:'p1',nome:'Dra. Camila Torres',esp:'Fisioterapia',crm:'CREFITO 12.345-F',sala:'Sala 1 — Fisioterapia',bio:'Fisioterapeuta com 12 anos de experiência em reabilitação ortopédica e esportiva.'},
    {id:'p2',nome:'Dr. Rafael Nunes',esp:'Nutrição',crm:'CRN-3 54.321',sala:'Sala 2 — Nutrição',bio:'Nutricionista especializado em nutrição funcional e terapêutica metabólica.'},
    {id:'p3',nome:'Dra. Beatriz Lemos',esp:'Psicologia',crm:'CRP 06/98765',sala:'Sala 3 — Psicologia',bio:'Psicóloga clínica com abordagem cognitivo-comportamental.'},
    {id:'p4',nome:'Dr. André Melo',esp:'Fisioterapia',crm:'CREFITO 18.902-F',sala:'Sala 4 — Fisioterapia',bio:'Fisioterapeuta especializado em reabilitação esportiva e postural.'},
  ]
  const MOCK_PAT_MAP = {
    'Dra. Camila Torres': { count: 6, consultas: 58 },
    'Dr. Rafael Nunes':   { count: 5, consultas: 56 },
    'Dra. Beatriz Lemos': { count: 6, consultas: 54 },
    'Dr. André Melo':     { count: 3, consultas: 38 },
  }

  useEffect(() => {
    getProfessionals().then(data => {
      if (data && data.length > 0) {
        setProfs(isProfissional ? data.filter(p => p.nome === profNome) : data)
      } else {
        setProfs(isProfissional ? MOCK_PROFS.filter(p => p.nome === profNome) : MOCK_PROFS)
      }
    }).catch(() => {
      setProfs(isProfissional ? MOCK_PROFS.filter(p => p.nome === profNome) : MOCK_PROFS)
    })
    getPatients().then(patients => {
      if (patients && patients.length > 0) {
        const map = {}
        patients.forEach(p => {
          if (!map[p.prof]) map[p.prof] = { count: 0, consultas: 0 }
          map[p.prof].count++
          map[p.prof].consultas += p.visitCount || 0
        })
        setPatientMap(map)
      } else {
        setPatientMap(MOCK_PAT_MAP)
      }
    }).catch(() => { setPatientMap(MOCK_PAT_MAP) })
  }, [isProfissional, profNome])

  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>{isProfissional ? 'Meu Perfil' : 'Profissionais'}</PageTitle>
          <PageSub>{isProfissional ? 'Seus dados profissionais' : 'Equipe clínica da VitaClin'}</PageSub>
        </div>
      </PageHeader>
      <Grid>
        {profs.map(pr => (
          <PCard key={pr.id} onClick={() => setSelectedProf(pr)}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              <Av>{initials(pr.nome)}</Av>
              <div>
                <div style={{fontSize:14,fontWeight:700}}>{pr.nome}</div>
                <Badge $variant={ESP_BADGE[pr.esp]||'gray'} style={{marginTop:3}}>{pr.esp}</Badge>
                <div style={{fontSize:10.5,color:'#9aaebb',marginTop:3}}>{pr.crm}</div>
              </div>
            </div>
            <div style={{fontSize:12,color:'#7a90a0',lineHeight:1.6,marginBottom:10}}>{pr.bio?.substring(0,90)}…</div>
            <div style={{fontSize:11,color:'#9aaebb',marginBottom:10}}>Sala: {pr.sala}</div>
            <StatBox>
              <StatItem><div style={{fontSize:18,fontWeight:700,color:'#2e9ac4'}}>{patientMap[pr.nome]?.count ?? '—'}</div><div style={{fontSize:10.5,color:'#7a90a0',marginTop:1}}>Pacientes</div></StatItem>
              <StatItem><div style={{fontSize:18,fontWeight:700}}>{patientMap[pr.nome]?.consultas ?? '—'}</div><div style={{fontSize:10.5,color:'#7a90a0',marginTop:1}}>Consultas</div></StatItem>
            </StatBox>
          </PCard>
        ))}
      </Grid>

      {selectedProf && (
        <ProfessionalProfile
          prof={selectedProf}
          onClose={() => setSelectedProf(null)}
        />
      )}
    </div>
  )
}
