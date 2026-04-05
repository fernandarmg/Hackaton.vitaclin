from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_db, close_db
from app.routes import patients, professionals, appointments, finances, users

app = FastAPI(
    title="VitaClin API",
    description="API de gestão clínica para fisioterapia, nutrição e psicologia",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db()

app.include_router(users.router,         prefix="/api/users",         tags=["Usuários"])
app.include_router(patients.router,      prefix="/api/patients",      tags=["Pacientes"])
app.include_router(professionals.router, prefix="/api/professionals", tags=["Profissionais"])
app.include_router(appointments.router,  prefix="/api/appointments",  tags=["Agendamentos"])
app.include_router(finances.router,      prefix="/api/finances",      tags=["Financeiro"])

@app.get("/")
async def root():
    return {"message": "VitaClin API rodando", "docs": "/docs"}
