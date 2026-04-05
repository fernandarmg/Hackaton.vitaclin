from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from bson import ObjectId
from app.database import get_db
from app.schemas.models import AppointmentCreate, AppointmentUpdate, AppointmentOut

router = APIRouter()

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.post("/", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
async def create_appointment(appt: AppointmentCreate):
    db = get_db()
    result = await db.appointments.insert_one(appt.dict())
    created = await db.appointments.find_one({"_id": result.inserted_id})
    return serialize(created)

@router.get("/", response_model=List[AppointmentOut])
async def list_appointments(
    prof:   Optional[str] = Query(None),
    date:   Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    pacId:  Optional[str] = Query(None),
):
    db = get_db()
    query = {}
    if prof:   query["prof"]   = prof
    if date:   query["date"]   = date
    if status: query["status"] = status
    if pacId:  query["pacId"]  = pacId
    cursor = db.appointments.find(query).sort([("date", 1), ("time", 1)])
    return [serialize(doc) async for doc in cursor]

@router.get("/{appt_id}", response_model=AppointmentOut)
async def get_appointment(appt_id: str):
    db = get_db()
    doc = await db.appointments.find_one({"_id": ObjectId(appt_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return serialize(doc)

@router.put("/{appt_id}", response_model=AppointmentOut)
async def update_appointment(appt_id: str, appt: AppointmentUpdate):
    db = get_db()
    update_data = {k: v for k, v in appt.dict().items() if v is not None}
    result = await db.appointments.update_one(
        {"_id": ObjectId(appt_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    updated = await db.appointments.find_one({"_id": ObjectId(appt_id)})
    return serialize(updated)

@router.patch("/{appt_id}/confirm", response_model=AppointmentOut)
async def confirm_appointment(appt_id: str):
    db = get_db()
    result = await db.appointments.update_one(
        {"_id": ObjectId(appt_id)}, {"$set": {"status": "confirmed"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    updated = await db.appointments.find_one({"_id": ObjectId(appt_id)})
    return serialize(updated)

@router.delete("/{appt_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appt_id: str):
    db = get_db()
    result = await db.appointments.delete_one({"_id": ObjectId(appt_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
