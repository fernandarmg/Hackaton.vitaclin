from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

# ── Enums ────────────────────────────────────────────────
class EspecialidadeEnum(str, Enum):
    fisioterapia = "Fisioterapia"
    nutricao     = "Nutrição"
    psicologia   = "Psicologia"

class PlanoEnum(str, Enum):
    basico     = "Básico"
    premium    = "Premium"
    fidelidade = "Fidelidade"
    avulso     = "Avulso"

class StatusApptEnum(str, Enum):
    pending   = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"

class StatusFinEnum(str, Enum):
    pago      = "Pago"
    pendente  = "Pendente"
    cancelado = "Cancelado"

class UserRoleEnum(str, Enum):
    admin        = "admin"
    profissional = "profissional"

# ── User ────────────────────────────────────────────────
class UserCreate(BaseModel):
    nome:     str
    email:    str
    senha:    str
    role:     UserRoleEnum = UserRoleEnum.profissional
    profNome: Optional[str] = None   # nome do profissional vinculado

class UserOut(BaseModel):
    id:       str
    nome:     str
    email:    str
    role:     UserRoleEnum
    profNome: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    senha: str

# ── Patient ─────────────────────────────────────────────
class PatientCreate(BaseModel):
    nome:       str
    cont:       str
    nasc:       Optional[str] = None
    esp:        EspecialidadeEnum
    prof:       str
    plano:      PlanoEnum = PlanoEnum.avulso
    freqPresc:  Optional[str] = None
    obs:        Optional[str] = None
    peso:       Optional[str] = None
    altura:     Optional[str] = None
    sangue:     Optional[str] = None
    lastVisit:  Optional[str] = None
    visitCount: int = 0

class PatientUpdate(BaseModel):
    nome:       Optional[str] = None
    cont:       Optional[str] = None
    nasc:       Optional[str] = None
    esp:        Optional[EspecialidadeEnum] = None
    prof:       Optional[str] = None
    plano:      Optional[PlanoEnum] = None
    freqPresc:  Optional[str] = None
    obs:        Optional[str] = None
    peso:       Optional[str] = None
    altura:     Optional[str] = None
    sangue:     Optional[str] = None
    lastVisit:  Optional[str] = None
    visitCount: Optional[int] = None

class PatientOut(PatientCreate):
    id: str

# ── Professional ─────────────────────────────────────────
class ProfessionalCreate(BaseModel):
    nome:     str
    esp:      EspecialidadeEnum
    crm:      str
    bio:      Optional[str] = None
    formacao: Optional[str] = None
    sala:     Optional[str] = None
    schedule: Optional[dict] = {}

class ProfessionalUpdate(BaseModel):
    nome:     Optional[str] = None
    esp:      Optional[EspecialidadeEnum] = None
    crm:      Optional[str] = None
    bio:      Optional[str] = None
    formacao: Optional[str] = None
    sala:     Optional[str] = None
    schedule: Optional[dict] = None

class ProfessionalOut(ProfessionalCreate):
    id: str

# ── Appointment ──────────────────────────────────────────
class AppointmentCreate(BaseModel):
    pacId:   Optional[str] = None
    pacNome: Optional[str] = None
    prof:    str
    sala:    Optional[str] = None
    date:    str
    time:    str
    obs:     Optional[str] = None
    status:  StatusApptEnum = StatusApptEnum.pending

class AppointmentUpdate(BaseModel):
    prof:   Optional[str] = None
    sala:   Optional[str] = None
    date:   Optional[str] = None
    time:   Optional[str] = None
    obs:    Optional[str] = None
    status: Optional[StatusApptEnum] = None

class AppointmentOut(AppointmentCreate):
    id: str

# ── Finance ──────────────────────────────────────────────
class FinanceCreate(BaseModel):
    pacId:    Optional[str] = None
    pacNome:  str
    svc:      str
    prof:     str
    plano:    Optional[PlanoEnum] = PlanoEnum.avulso
    valor:    float
    status:   StatusFinEnum = StatusFinEnum.pendente
    forma:    Optional[str] = None
    data:     str

class FinanceUpdate(BaseModel):
    svc:    Optional[str] = None
    prof:   Optional[str] = None
    plano:  Optional[PlanoEnum] = None
    valor:  Optional[float] = None
    status: Optional[StatusFinEnum] = None
    forma:  Optional[str] = None
    data:   Optional[str] = None

class FinanceOut(FinanceCreate):
    id: str
