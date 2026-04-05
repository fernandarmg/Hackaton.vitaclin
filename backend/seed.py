"""
Popula o banco com dados de demonstração da VitaClin.
Execute: python seed.py
"""
import asyncio, os, motor.motor_asyncio
from datetime import date, timedelta
from dotenv import load_dotenv

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME", "vitaclin")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ── Helpers ──────────────────────────────────────────────
DAY_NAME_TO_WEEKDAY = {'Seg':0,'Ter':1,'Qua':2,'Qui':3,'Sex':4}
TODAY = date(2026, 4, 5)

PROFESSIONALS_DATA = [
    {"nome":"Dra. Camila Torres","esp":"Fisioterapia","crm":"CREFITO 12.345-F",
     "bio":"Fisioterapeuta com 12 anos de experiência em reabilitação ortopédica e esportiva.",
     "formacao":"USP — Esp. Fisioterapia Ortopédica UNICAMP","sala":"Sala 1 — Fisioterapia",
     "schedule":{"Seg":["08:00","09:00","10:00","11:00","14:00","15:00","16:00"],
                 "Ter":["08:00","09:00","10:00","11:00","14:00","15:00","16:00"],
                 "Qua":["08:00","09:00","10:00","11:00"],
                 "Qui":["08:00","09:00","10:00","11:00","14:00","15:00","16:00"],
                 "Sex":["08:00","09:00","10:00","11:00"]}},
    {"nome":"Dr. Rafael Nunes","esp":"Nutrição","crm":"CRN-3 54.321",
     "bio":"Nutricionista especializado em nutrição funcional e terapêutica metabólica.",
     "formacao":"UNIFESP — Pós-graduação Nutrição Funcional VP","sala":"Sala 2 — Nutrição",
     "schedule":{"Seg":["09:00","10:00","11:00","15:00","16:00","17:00"],
                 "Ter":["09:00","10:00","11:00","15:00","16:00","17:00"],
                 "Qua":["09:00","10:00","11:00","15:00","16:00","17:00"],
                 "Qui":["09:00","10:00","11:00"],
                 "Sex":["09:00","10:00","11:00","15:00","16:00"]}},
    {"nome":"Dra. Beatriz Lemos","esp":"Psicologia","crm":"CRP 06/98765",
     "bio":"Psicóloga clínica com abordagem cognitivo-comportamental.",
     "formacao":"PUC-SP — Especialização TCC Instituto Beck Brasil","sala":"Sala 3 — Psicologia",
     "schedule":{"Seg":["10:00","11:00","14:00","15:00","16:00","17:00","18:00"],
                 "Ter":["10:00","11:00","14:00","15:00","16:00","17:00"],
                 "Qua":["14:00","15:00","16:00","17:00","18:00"],
                 "Qui":["10:00","11:00","14:00","15:00","16:00","17:00","18:00"],
                 "Sex":["14:00","15:00","16:00","17:00"]}},
    {"nome":"Dr. André Melo","esp":"Fisioterapia","crm":"CREFITO 18.902-F",
     "bio":"Fisioterapeuta especializado em reabilitação esportiva e postural.",
     "formacao":"UNIFESP — Pós-graduação Fisioterapia Esportiva CREFITO","sala":"Sala 4 — Fisioterapia",
     "schedule":{"Seg":["07:00","08:00","09:00","10:00","17:00","18:00","19:00"],
                 "Ter":["07:00","08:00","09:00","10:00","17:00","18:00","19:00"],
                 "Qua":["07:00","08:00","09:00","10:00","17:00","18:00","19:00"],
                 "Qui":["07:00","08:00","09:00","10:00","17:00","18:00","19:00"],
                 "Sex":["07:00","08:00","09:00","10:00"]}},
]

PROF_SALA  = {p["nome"]: p["sala"]     for p in PROFESSIONALS_DATA}
PROF_SCHED = {p["nome"]: p["schedule"] for p in PROFESSIONALS_DATA}

# Per-prof, per-day time cursor
_day_cursor = {}   # { prof_nome: { day_name: idx } }

def claim_day_time(prof_nome, day_name):
    """Return the next available time for this prof on this day (round-robin)."""
    sched = PROF_SCHED[prof_nome]
    times = sched.get(day_name, [])
    if not times:
        return None
    dc = _day_cursor.setdefault(prof_nome, {})
    idx = dc.get(day_name, 0)
    time = times[idx % len(times)]
    dc[day_name] = idx + 1
    return time

# Cycle through available days for each prof
_day_idx = {}  # { prof_nome: index into WEEK_DAYS }
WEEK_DAYS_ORDER = ['Seg','Ter','Qua','Qui','Sex']

def claim_slots(prof_nome, n):
    """Return n (day_name, time) pairs — each on a DIFFERENT day if possible."""
    sched   = PROF_SCHED[prof_nome]
    avail   = [d for d in WEEK_DAYS_ORDER if sched.get(d)]
    result  = []
    used    = set()
    start_i = _day_idx.get(prof_nome, 0)
    for offset in range(len(avail) * 2):
        if len(result) >= n:
            break
        day = avail[(start_i + offset) % len(avail)]
        if day in used:
            continue
        t = claim_day_time(prof_nome, day)
        if t:
            result.append((day, t))
            used.add(day)
    _day_idx[prof_nome] = (start_i + n) % len(avail)
    return result

def next_weekday(from_date, weekday):
    d = from_date
    while d.weekday() != weekday:
        d += timedelta(days=1)
    return d

def generate_dates(day_name, freq, start, end):
    wd  = DAY_NAME_TO_WEEKDAY[day_name]
    cur = next_weekday(start, wd)
    step = {'2x/semana':7, 'Semanal':7, 'Quinzenal':14, 'Mensal':28, 'Avulso':21}[freq]
    dates = []
    while cur <= end:
        dates.append(cur)
        cur += timedelta(days=step)
    return dates

def appt_status(d):
    if d < TODAY - timedelta(days=1):
        return "confirmed"
    if d <= TODAY + timedelta(days=3):
        return "pending"
    return "confirmed"

PATIENTS_DATA = [
    {"nome":"Ana Beatriz Ferreira","cont":"(11) 9 8421-3302","nasc":"1990-04-12","esp":"Fisioterapia","prof":"Dra. Camila Torres","plano":"Premium",   "freqPresc":"2x/semana","obs":"Pós-operatório de joelho.",          "peso":"68kg","altura":"1,65m","sangue":"A+", "lastVisit":"2026-04-02","visitCount":14},
    {"nome":"Carlos Eduardo Lima", "cont":"(11) 9 7133-0041","nasc":"1985-11-23","esp":"Nutrição",    "prof":"Dr. Rafael Nunes",  "plano":"Fidelidade","freqPresc":"Semanal",   "obs":"Diabetes tipo 2.",                   "peso":"92kg","altura":"1,78m","sangue":"O+", "lastVisit":"2026-04-02","visitCount":18},
    {"nome":"Fernanda Costa Alves","cont":"(11) 9 9200-8821","nasc":"1998-07-05","esp":"Psicologia",  "prof":"Dra. Beatriz Lemos","plano":"Premium",   "freqPresc":"Semanal",   "obs":"Ansiedade generalizada.",            "peso":"58kg","altura":"1,62m","sangue":"B-", "lastVisit":"2026-03-27","visitCount":11},
    {"nome":"Roberto Mendonça",    "cont":"(11) 9 6543-1100","nasc":"1975-02-18","esp":"Fisioterapia","prof":"Dra. Camila Torres","plano":"Básico",    "freqPresc":"Quinzenal",  "obs":"Lombalgia crônica.",                 "peso":"84kg","altura":"1,75m","sangue":"AB+","lastVisit":"2026-02-26","visitCount":6},
    {"nome":"Juliana Martins",     "cont":"(11) 9 8812-4456","nasc":"2001-09-30","esp":"Nutrição",    "prof":"Dr. Rafael Nunes",  "plano":"Premium",   "freqPresc":"Quinzenal",  "obs":"Reeducação alimentar.",              "peso":"72kg","altura":"1,68m","sangue":"O-", "lastVisit":"2026-04-01","visitCount":12},
    {"nome":"Marcelo Souza",       "cont":"(11) 9 9911-2233","nasc":"1988-03-15","esp":"Psicologia",  "prof":"Dra. Beatriz Lemos","plano":"Premium",   "freqPresc":"Semanal",   "obs":"Depressão leve.",                    "peso":"79kg","altura":"1,80m","sangue":"A-", "lastVisit":"2026-04-02","visitCount":9},
    {"nome":"Patrícia Almeida",    "cont":"(11) 9 7654-3210","nasc":"1992-08-22","esp":"Fisioterapia","prof":"Dra. Camila Torres","plano":"Fidelidade","freqPresc":"2x/semana", "obs":"Hérnia de disco L4-L5.",             "peso":"65kg","altura":"1,62m","sangue":"B+", "lastVisit":"2026-04-01","visitCount":16},
    {"nome":"Gabriel Teixeira",    "cont":"(11) 9 9001-2233","nasc":"2000-05-19","esp":"Nutrição",    "prof":"Dr. Rafael Nunes",  "plano":"Fidelidade","freqPresc":"Semanal",   "obs":"Alto rendimento esportivo.",         "peso":"78kg","altura":"1,83m","sangue":"O+", "lastVisit":"2026-04-02","visitCount":20},
    {"nome":"Thiago Nascimento",   "cont":"(11) 9 8765-4321","nasc":"1989-03-08","esp":"Psicologia",  "prof":"Dra. Beatriz Lemos","plano":"Fidelidade","freqPresc":"Semanal",   "obs":"Burnout e estresse crônico.",        "peso":"82kg","altura":"1,77m","sangue":"O-", "lastVisit":"2026-03-31","visitCount":15},
    {"nome":"Isabela Rodrigues",   "cont":"(11) 9 9876-5432","nasc":"1993-06-17","esp":"Fisioterapia","prof":"Dra. Camila Torres","plano":"Fidelidade","freqPresc":"2x/semana", "obs":"Tendinite no ombro direito.",        "peso":"61kg","altura":"1,60m","sangue":"A+", "lastVisit":"2026-04-02","visitCount":13},
    {"nome":"Diego Barbosa",       "cont":"(11) 9 6655-4433","nasc":"1987-07-25","esp":"Fisioterapia","prof":"Dra. Camila Torres","plano":"Premium",   "freqPresc":"2x/semana", "obs":"Reabilitação pós-fratura tornozelo.","peso":"88kg","altura":"1,80m","sangue":"AB-","lastVisit":"2026-04-01","visitCount":10},
    {"nome":"Felipe Cunha",        "cont":"(11) 9 7766-5544","nasc":"1991-12-28","esp":"Psicologia",  "prof":"Dra. Beatriz Lemos","plano":"Premium",   "freqPresc":"Semanal",   "obs":"TAG — transtorno de ansiedade.",     "peso":"77kg","altura":"1,75m","sangue":"A+", "lastVisit":"2026-04-01","visitCount":11},
    {"nome":"Bruno Cavalcanti",    "cont":"(11) 9 5533-8899","nasc":"1983-08-07","esp":"Fisioterapia","prof":"Dr. André Melo",    "plano":"Fidelidade","freqPresc":"2x/semana", "obs":"Gonartrose bilateral.",              "peso":"95kg","altura":"1,76m","sangue":"AB+","lastVisit":"2026-04-02","visitCount":17},
    {"nome":"Leticia Prado",       "cont":"(11) 9 8800-1122","nasc":"1994-11-14","esp":"Nutrição",    "prof":"Dr. Rafael Nunes",  "plano":"Premium",   "freqPresc":"Semanal",   "obs":"Síndrome do intestino irritável.",   "peso":"61kg","altura":"1,64m","sangue":"A+", "lastVisit":"2026-02-22","visitCount":7},
    {"nome":"Mariana Vaz",         "cont":"(11) 9 7700-4455","nasc":"1997-03-21","esp":"Psicologia",  "prof":"Dra. Beatriz Lemos","plano":"Básico",    "freqPresc":"Quinzenal",  "obs":"Fobia social.",                      "peso":"55kg","altura":"1,60m","sangue":"O+", "lastVisit":"2026-02-24","visitCount":5},
    {"nome":"Paulo Henrique Dias", "cont":"(11) 9 6600-9988","nasc":"1980-06-30","esp":"Nutrição",    "prof":"Dr. Rafael Nunes",  "plano":"Fidelidade","freqPresc":"Semanal",   "obs":"Obesidade grau 1, hipertensão.",    "peso":"105kg","altura":"1,74m","sangue":"B+","lastVisit":"2026-02-28","visitCount":9},
    {"nome":"Renata Oliveira",     "cont":"(11) 9 9955-3344","nasc":"2002-08-09","esp":"Psicologia",  "prof":"Dra. Beatriz Lemos","plano":"Premium",   "freqPresc":"Semanal",   "obs":"Depressão pós-parto.",               "peso":"64kg","altura":"1,67m","sangue":"A-", "lastVisit":"2026-04-03","visitCount":8},
    {"nome":"Lucas Ferreira",      "cont":"(11) 9 8833-6677","nasc":"1995-01-17","esp":"Nutrição",    "prof":"Dr. Rafael Nunes",  "plano":"Premium",   "freqPresc":"Semanal",   "obs":"Ganho de massa muscular.",           "peso":"74kg","altura":"1,80m","sangue":"O+", "lastVisit":"2026-04-03","visitCount":6},
    {"nome":"Natália Freitas",     "cont":"(11) 9 7711-2200","nasc":"1999-05-05","esp":"Fisioterapia","prof":"Dr. André Melo",    "plano":"Fidelidade","freqPresc":"2x/semana", "obs":"Escoliose leve.",                    "peso":"57kg","altura":"1,63m","sangue":"B-", "lastVisit":"2026-04-02","visitCount":13},
    {"nome":"André Luiz Santos",   "cont":"(11) 9 9944-1133","nasc":"1978-12-03","esp":"Fisioterapia","prof":"Dr. André Melo",    "plano":"Básico",    "freqPresc":"Mensal",    "obs":"Artrite reumatoide.",                "peso":"79kg","altura":"1,72m","sangue":"AB+","lastVisit":"2026-04-01","visitCount":8},
    {"nome":"Camila Ramos",        "cont":"(11) 9 8822-5566","nasc":"1993-09-28","esp":"Psicologia",  "prof":"Dra. Beatriz Lemos","plano":"Fidelidade","freqPresc":"Semanal",   "obs":"TDAH adulto.",                       "peso":"66kg","altura":"1,65m","sangue":"A+", "lastVisit":"2026-04-02","visitCount":12},
    {"nome":"Rodrigo Fonseca",     "cont":"(11) 9 6611-4422","nasc":"1986-04-19","esp":"Nutrição",    "prof":"Dr. Rafael Nunes",  "plano":"Premium",   "freqPresc":"Quinzenal",  "obs":"Colesterol alto.",                   "peso":"88kg","altura":"1,79m","sangue":"O-", "lastVisit":"2026-04-01","visitCount":10},
    {"nome":"Bianca Mendes",       "cont":"(11) 9 9922-7788","nasc":"2003-07-11","esp":"Fisioterapia","prof":"Dra. Camila Torres","plano":"Premium",   "freqPresc":"2x/semana", "obs":"Lesão ligamentar no tornozelo.",     "peso":"52kg","altura":"1,58m","sangue":"B+", "lastVisit":"2026-04-03","visitCount":5},
]

async def seed():
    for col in ["users","patients","professionals","appointments","finances","reviews"]:
        await db[col].drop()
    print("Coleções limpas.")

    # ── Usuários
    await db.users.insert_many([
        {"nome":"Renata Souza",      "email":"renata@vitaclin.com",  "senha":"admin123",   "role":"admin",        "profNome":None},
        {"nome":"Dra. Camila Torres","email":"camila@vitaclin.com",  "senha":"camila123",  "role":"profissional", "profNome":"Dra. Camila Torres"},
        {"nome":"Dr. Rafael Nunes",  "email":"rafael@vitaclin.com",  "senha":"rafael123",  "role":"profissional", "profNome":"Dr. Rafael Nunes"},
        {"nome":"Dra. Beatriz Lemos","email":"beatriz@vitaclin.com", "senha":"beatriz123", "role":"profissional", "profNome":"Dra. Beatriz Lemos"},
        {"nome":"Dr. André Melo",    "email":"andre@vitaclin.com",   "senha":"andre123",   "role":"profissional", "profNome":"Dr. André Melo"},
    ])
    print("Usuários inseridos.")

    # ── Profissionais
    await db.professionals.insert_many(PROFESSIONALS_DATA)
    print("Profissionais inseridos.")

    # ── Pacientes
    await db.patients.insert_many(PATIENTS_DATA)
    print("Pacientes inseridos.")

    # ── Agendamentos gerados automaticamente ─────────────────
    START = date(2025, 11, 3)
    END   = date(2026, 4, 30)

    # Extra bookings for current week to fill it up
    EXTRA_WEEK = [
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-07","08:00","Ana Beatriz Ferreira","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-07","09:00","Patrícia Almeida","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-08","08:00","Roberto Mendonça","pending"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-08","09:00","Isabela Rodrigues","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-08","11:00","Diego Barbosa","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-08","14:00","Bianca Mendes","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-09","08:00","Ana Beatriz Ferreira","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-09","09:00","Patrícia Almeida","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-09","11:00","Diego Barbosa","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-10","08:00","Isabela Rodrigues","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-10","09:00","Bianca Mendes","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-10","14:00","Roberto Mendonça","pending"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-11","08:00","Patrícia Almeida","confirmed"),
        ("Dra. Camila Torres","Sala 1 — Fisioterapia","2026-04-11","09:00","Diego Barbosa","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-07","09:00","Carlos Eduardo Lima","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-07","10:00","Gabriel Teixeira","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-07","15:00","Paulo Henrique Dias","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-07","16:00","Rodrigo Fonseca","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-08","09:00","Juliana Martins","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-08","10:00","Lucas Ferreira","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-08","15:00","Leticia Prado","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-08","16:00","Carlos Eduardo Lima","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-09","09:00","Gabriel Teixeira","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-09","10:00","Paulo Henrique Dias","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-09","15:00","Rodrigo Fonseca","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-10","09:00","Lucas Ferreira","pending"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-10","10:00","Juliana Martins","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-11","09:00","Carlos Eduardo Lima","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-11","10:00","Gabriel Teixeira","confirmed"),
        ("Dr. Rafael Nunes","Sala 2 — Nutrição","2026-04-11","15:00","Paulo Henrique Dias","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-07","10:00","Fernanda Costa Alves","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-07","11:00","Marcelo Souza","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-07","14:00","Felipe Cunha","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-07","15:00","Camila Ramos","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-07","16:00","Thiago Nascimento","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-08","10:00","Renata Oliveira","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-08","11:00","Fernanda Costa Alves","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-08","14:00","Marcelo Souza","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-08","15:00","Felipe Cunha","pending"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-09","14:00","Camila Ramos","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-09","15:00","Thiago Nascimento","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-09","17:00","Renata Oliveira","pending"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-10","10:00","Fernanda Costa Alves","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-10","11:00","Marcelo Souza","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-10","14:00","Felipe Cunha","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-10","15:00","Camila Ramos","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-11","14:00","Thiago Nascimento","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-11","15:00","Renata Oliveira","confirmed"),
        ("Dra. Beatriz Lemos","Sala 3 — Psicologia","2026-04-11","16:00","Fernanda Costa Alves","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-07","07:00","Bruno Cavalcanti","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-07","08:00","Natália Freitas","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-07","09:00","André Luiz Santos","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-07","17:00","Bruno Cavalcanti","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-07","18:00","Natália Freitas","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-08","07:00","André Luiz Santos","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-08","08:00","Bruno Cavalcanti","pending"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-08","09:00","Natália Freitas","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-08","17:00","André Luiz Santos","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-08","18:00","Bruno Cavalcanti","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-09","07:00","Natália Freitas","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-09","08:00","André Luiz Santos","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-09","09:00","Bruno Cavalcanti","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-09","17:00","Natália Freitas","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-10","07:00","André Luiz Santos","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-10","08:00","Bruno Cavalcanti","pending"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-10","09:00","Natália Freitas","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-10","17:00","André Luiz Santos","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-11","07:00","Bruno Cavalcanti","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-11","08:00","Natália Freitas","confirmed"),
        ("Dr. André Melo","Sala 4 — Fisioterapia","2026-04-11","09:00","André Luiz Santos","confirmed"),
    ]

    appointments = []
    seen = set()  # prevent double-booking: (prof, date_str, time)

    for pat in PATIENTS_DATA:
        freq     = pat["freqPresc"]
        prof     = pat["prof"]
        sala     = PROF_SALA[prof]
        slots_n  = 2 if freq == "2x/semana" else 1
        slots    = claim_slots(prof, slots_n)  # [(day_name, time), ...]

        for (day_name, time) in slots:
            for d in generate_dates(day_name, freq, START, END):
                key = (prof, d.isoformat(), time)
                if key in seen:
                    continue
                seen.add(key)
                appointments.append({
                    "pacNome": pat["nome"],
                    "prof":    prof,
                    "sala":    sala,
                    "date":    d.isoformat(),
                    "time":    time,
                    "obs":     pat["obs"][:30],
                    "status":  appt_status(d),
                })

    # Add extra week bookings (avoid duplicates)
    for (prof, sala, date_str, time, pac, status) in EXTRA_WEEK:
        key = (prof, date_str, time)
        if key not in seen:
            seen.add(key)
            appointments.append({"pacNome":pac,"prof":prof,"sala":sala,"date":date_str,"time":time,"obs":"Consulta","status":status})

    await db.appointments.insert_many(appointments)
    print(f"Agendamentos inseridos: {len(appointments)}")

    # ── Financeiro — gerado a partir dos agendamentos passados confirmados
    finances = []
    VALOR = {"Fisioterapia": 170, "Nutrição": 150, "Psicologia": 200}
    FORMAS = ["Pix", "Cartão de crédito", "Débito", "Pix", "Pix"]
    ESP_PAT = {p["nome"]: p["esp"] for p in PATIENTS_DATA}

    for i, a in enumerate(appointments):
        if a["status"] == "confirmed" and a["date"] < TODAY.isoformat():
            esp = ESP_PAT.get(a["pacNome"], "Fisioterapia")
            plano_pat = next((p["plano"] for p in PATIENTS_DATA if p["nome"] == a["pacNome"]), "Avulso")
            valor = VALOR.get(esp, 170)
            if plano_pat == "Fidelidade":
                valor = int(valor * 0.88)
            elif plano_pat == "Básico":
                valor = int(valor * 0.75)
            finances.append({
                "pacNome": a["pacNome"],
                "svc":     esp,
                "prof":    a["prof"],
                "plano":   plano_pat,
                "valor":   valor,
                "status":  "Pago",
                "forma":   FORMAS[i % len(FORMAS)],
                "data":    a["date"],
            })

    # Alguns pendentes (próximos 10 dias)
    for a in appointments:
        if a["status"] == "pending" and a["date"] >= TODAY.isoformat():
            esp = ESP_PAT.get(a["pacNome"], "Fisioterapia")
            plano_pat = next((p["plano"] for p in PATIENTS_DATA if p["nome"] == a["pacNome"]), "Avulso")
            finances.append({
                "pacNome": a["pacNome"],
                "svc":     esp,
                "prof":    a["prof"],
                "plano":   plano_pat,
                "valor":   VALOR.get(esp, 170),
                "status":  "Pendente",
                "forma":   "—",
                "data":    a["date"],
            })
            break  # só um pendente de exemplo

    await db.finances.insert_many(finances)
    print(f"Financeiro inserido: {len(finances)} lançamentos")

    # ── Avaliações
    await db.reviews.insert_many([
        {"pacNome":"Isabela Rodrigues","texto":"Estrutura impecável e atendimento humanizado.","nota":5,"data":"2026-04-02"},
        {"pacNome":"Gabriel Teixeira", "texto":"Ótimo suporte para minha performance nos treinos.","nota":4,"data":"2026-04-01"},
        {"pacNome":"Marcelo Souza",    "texto":"Profissionais muito atenciosos e competentes.","nota":5,"data":"2026-03-30"},
        {"pacNome":"Juliana Martins",  "texto":"Me sinto muito mais saudável desde que comecei.","nota":5,"data":"2026-03-28"},
        {"pacNome":"Bruno Cavalcanti", "texto":"Ótima clínica, recomendo a todos.","nota":4,"data":"2026-03-25"},
        {"pacNome":"Patrícia Almeida", "texto":"Atendimento excelente, equipe muito preparada.","nota":5,"data":"2026-03-20"},
        {"pacNome":"Thiago Nascimento","texto":"Tratamento eficaz, sinto melhora real.","nota":4,"data":"2026-03-18"},
    ])
    print("Avaliações inseridas.")
    print(f"\n✓ Seed concluído!")
    print("Login admin:   renata@vitaclin.com  / admin123")
    print("Login profis.: camila@vitaclin.com  / camila123")

asyncio.run(seed())
