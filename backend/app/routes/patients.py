from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from bson import ObjectId
from app.database import get_db
from app.schemas.models import PatientCreate, PatientUpdate, PatientOut

router = APIRouter()

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

# ── CREATE ───────────────────────────────────────────────
@router.post("/", response_model=PatientOut, status_code=status.HTTP_201_CREATED)
async def create_patient(patient: PatientCreate):
    db = get_db()
    result = await db.patients.insert_one(patient.dict())
    created = await db.patients.find_one({"_id": result.inserted_id})
    return serialize(created)

# ── READ ALL ─────────────────────────────────────────────
@router.get("/", response_model=List[PatientOut])
async def list_patients(
    esp:  Optional[str] = Query(None),
    prof: Optional[str] = Query(None),
    plano: Optional[str] = Query(None),
):
    db = get_db()
    query = {}
    if esp:   query["esp"]  = esp
    if prof:  query["prof"] = prof
    if plano: query["plano"] = plano
    cursor = db.patients.find(query)
    return [serialize(doc) async for doc in cursor]

# ── READ ONE ─────────────────────────────────────────────
@router.get("/{patient_id}", response_model=PatientOut)
async def get_patient(patient_id: str):
    db = get_db()
    doc = await db.patients.find_one({"_id": ObjectId(patient_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return serialize(doc)

# ── UPDATE ───────────────────────────────────────────────
@router.put("/{patient_id}", response_model=PatientOut)
async def update_patient(patient_id: str, patient: PatientUpdate):
    db = get_db()
    update_data = {k: v for k, v in patient.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")
    result = await db.patients.update_one(
        {"_id": ObjectId(patient_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    updated = await db.patients.find_one({"_id": ObjectId(patient_id)})
    return serialize(updated)

# ── DELETE ───────────────────────────────────────────────
@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(patient_id: str):
    db = get_db()
    result = await db.patients.delete_one({"_id": ObjectId(patient_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
