import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { getPatients, createPatient, updatePatient, deletePatient } from '../services/api'
import {
  PageHeader, PageTitle, PageSub, PrimaryButton, Button, DangerButton,
  TableWrap, Table, Th, Td, Badge, FormGroup, FormLabel, FormInput, FormSelect,
} from '../components/ui'
import PatientProfile from './PatientProfile'

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`

const SearchInput = styled(FormInput)`
  flex: 1;
  min-width: 180px;
`

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(30,60,80,.42);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalCard = styled.div`
  background: #fff;
  border-radius: ${({ theme }) => theme.radii.xxl};
  padding: 26px;
  width: 540px;
  max-width: 96vw;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.g100};
`

const PC = styled.div` display: flex; align-items: center; gap: 9px; `
const PAv = styled.div`
  width: 32px; height: 32px; border-radius: 50%;
  background: ${({ theme }) => theme.colors.b5};
  color: ${({ theme }) => theme.colors.b1};
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; flex-shrink: 0;
`

const ESP_BADGE = { Fisioterapia:'sky', Nutrição:'teal', Psicologia:'purple' }
const PLANO_BADGE = { Premium:'amber', Fidelidade:'sky', Básico:'navy', Avulso:'gray' }
const initials = n => n?.trim().split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?'
const fmtDate = d => !d?'—':d.split('-').reverse().join('/')

const EMPTY = { nome:'',cont:'',nasc:'',esp:'Fisioterapia',prof:'',plano:'Básico',freqPresc:'Semanal',obs:'',peso:'',altura:'',sangue:'' }

export default function PatientsPage() {
  const { isAdmin, isProfissional, profNome } = useAuth()
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [filtEsp, setFiltEsp] = useState('')
  const [filtPlano, setFiltPlano] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (isProfissional) params.prof = profNome
      if (filtEsp)   params.esp   = filtEsp
      if (filtPlano) params.plano = filtPlano
      const data = await getPatients(params)
      setPatients(data || [])
    } catch (e) {
      console.error(e)
      setPatients([])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filtEsp, filtPlano])

  const filtered = patients.filter(p =>
    !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.cont.includes(search)
  )

  const openNew = () => {
    setEditing(null)
    setForm({ ...EMPTY, prof: isProfissional ? profNome : '' })
    setModal(true)
  }

  const openEdit = (p) => {
    setEditing(p.id)
    setForm({ nome:p.nome,cont:p.cont,nasc:p.nasc||'',esp:p.esp,prof:p.prof,plano:p.plano,freqPresc:p.freqPresc||'Semanal',obs:p.obs||'',peso:p.peso||'',altura:p.altura||'',sangue:p.sangue||'' })
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.nome || !form.cont || !form.esp) return
    try {
      if (editing) {
        await updatePatient(editing, form)
      } else {
        await createPatient({ ...form, visitCount: 0 })
      }
      setModal(false)
      load()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover este paciente?')) return
    await deletePatient(id)
    load()
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>Pacientes</PageTitle>
          <PageSub>{patients.length} paciente{patients.length !== 1 ? 's' : ''} {isProfissional ? 'sob seus cuidados' : 'cadastrados'}</PageSub>
        </div>
        {isAdmin && <PrimaryButton onClick={openNew}>+ Novo paciente</PrimaryButton>}
      </PageHeader>

      <FilterRow>
        <SearchInput placeholder="Buscar por nome ou contato…" value={search} onChange={e=>setSearch(e.target.value)} />
        <FormSelect value={filtEsp} onChange={e=>setFiltEsp(e.target.value)} style={{minWidth:160}}>
          <option value="">Todas as especialidades</option>
          <option>Fisioterapia</option><option>Nutrição</option><option>Psicologia</option>
        </FormSelect>
        <FormSelect value={filtPlano} onChange={e=>setFiltPlano(e.target.value)} style={{minWidth:140}}>
          <option value="">Todos os planos</option>
          <option>Básico</option><option>Premium</option><option>Fidelidade</option><option>Avulso</option>
        </FormSelect>
      </FilterRow>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Paciente</Th><Th>Contato</Th><Th>Especialidade</Th>
              <Th>Profissional</Th><Th>Plano</Th><Th>Última consulta</Th>
              <Th style={{width:70}}></Th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><Td colSpan={7} style={{textAlign:'center',padding:28,color:'#9aaebb'}}>Carregando…</Td></tr>
              : filtered.length === 0
                ? <tr><Td colSpan={7} style={{textAlign:'center',padding:28,color:'#bfcdd8'}}>Nenhum paciente encontrado</Td></tr>
                : filtered.map(p => (
                    <tr key={p.id}>
                      <Td>
                        <PC style={{cursor:'pointer'}} onClick={() => setSelectedPatient(p)}>
                          <PAv>{initials(p.nome)}</PAv>
                          <div>
                            <div style={{fontWeight:600,color:'#1a6fa8',textDecoration:'underline dotted'}}>{p.nome}</div>
                            <div style={{fontSize:11,color:'#7a90a0'}}>{p.obs?.substring(0,36)}</div>
                          </div>
                        </PC>
                      </Td>
                      <Td style={{fontSize:12.5}}>{p.cont}</Td>
                      <Td><Badge $variant={ESP_BADGE[p.esp]||'gray'}>{p.esp}</Badge></Td>
                      <Td style={{fontSize:12.5,color:'#7a90a0'}}>{p.prof}</Td>
                      <Td><Badge $variant={PLANO_BADGE[p.plano]||'gray'}>{p.plano}</Badge></Td>
                      <Td style={{fontSize:12}}>{fmtDate(p.lastVisit)}</Td>
                      <Td>
                        <div style={{display:'flex',gap:5}}>
                          <Button className="sm" onClick={() => openEdit(p)} title="Editar">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M7.5 1.5l2 2-6.5 6.5H1V8l6.5-6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                          </Button>
                          {isAdmin && (
                            <DangerButton className="sm" onClick={() => handleDelete(p.id)} title="Remover">
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 3h8M4 3V2h3v1M3.5 3v6a1 1 0 001 1h2a1 1 0 001-1V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                            </DangerButton>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))
            }
          </tbody>
        </Table>
      </TableWrap>

      {selectedPatient && (
        <PatientProfile
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onEdit={() => {
            const p = selectedPatient
            setSelectedPatient(null)
            setTimeout(() => openEdit(p), 80)
          }}
        />
      )}

      {modal && (
        <Modal onClick={e => e.target === e.currentTarget && setModal(false)}>
          <ModalCard>
            <ModalTitle>{editing ? 'Editar paciente' : 'Novo paciente'}</ModalTitle>
            <FormRow>
              <FormGroup><FormLabel>Nome *</FormLabel><FormInput value={form.nome} onChange={set('nome')} placeholder="Nome completo"/></FormGroup>
              <FormGroup><FormLabel>Contato *</FormLabel><FormInput value={form.cont} onChange={set('cont')} placeholder="(11) 9..."/></FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup><FormLabel>Nascimento</FormLabel><FormInput type="date" value={form.nasc} onChange={set('nasc')}/></FormGroup>
              <FormGroup><FormLabel>Especialidade *</FormLabel>
                <FormSelect value={form.esp} onChange={set('esp')}>
                  <option>Fisioterapia</option><option>Nutrição</option><option>Psicologia</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup><FormLabel>Profissional</FormLabel><FormInput value={form.prof} onChange={set('prof')} disabled={isProfissional}/></FormGroup>
              <FormGroup><FormLabel>Plano</FormLabel>
                <FormSelect value={form.plano} onChange={set('plano')}>
                  <option>Básico</option><option>Premium</option><option>Fidelidade</option><option>Avulso</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup><FormLabel>Frequência</FormLabel>
                <FormSelect value={form.freqPresc} onChange={set('freqPresc')}>
                  <option>Semanal</option><option>2x/semana</option><option>Quinzenal</option><option>Mensal</option>
                </FormSelect>
              </FormGroup>
              <FormGroup><FormLabel>Sangue</FormLabel><FormInput value={form.sangue} onChange={set('sangue')} placeholder="A+"/></FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup><FormLabel>Peso</FormLabel><FormInput value={form.peso} onChange={set('peso')} placeholder="68kg"/></FormGroup>
              <FormGroup><FormLabel>Altura</FormLabel><FormInput value={form.altura} onChange={set('altura')} placeholder="1,65m"/></FormGroup>
            </FormRow>
            <FormGroup><FormLabel>Observações</FormLabel>
              <FormInput as="textarea" rows={2} value={form.obs} onChange={set('obs')} placeholder="Diagnóstico, observações clínicas…" style={{resize:'vertical',minHeight:60}}/>
            </FormGroup>
            <ModalFooter>
              <Button onClick={() => setModal(false)}>Cancelar</Button>
              <PrimaryButton onClick={handleSave}>{editing ? 'Salvar alterações' : 'Cadastrar paciente'}</PrimaryButton>
            </ModalFooter>
          </ModalCard>
        </Modal>
      )}
    </div>
  )
}
