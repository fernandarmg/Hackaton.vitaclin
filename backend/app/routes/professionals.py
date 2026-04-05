from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId
from app.database import get_db
from app.schemas.models import ProfessionalCreate, ProfessionalUpdate, ProfessionalOut

router = APIRouter()

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.post("/", response_model=ProfessionalOut, status_code=status.HTTP_201_CREATED)
async def create_professional(prof: ProfessionalCreate):
    db = get_db()
    result = await db.professionals.insert_one(prof.dict())
    created = await db.professionals.find_one({"_id": result.inserted_id})
    return serialize(created)

@router.get("/", response_model=List[ProfessionalOut])
async def list_professionals():
    db = get_db()
    cursor = db.professionals.find()
    return [serialize(doc) async for doc in cursor]

@router.get("/{prof_id}", response_model=ProfessionalOut)
async def get_professional(prof_id: str):
    db = get_db()
    doc = await db.professionals.find_one({"_id": ObjectId(prof_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Profissional não encontrado")
    return serialize(doc)

@router.put("/{prof_id}", response_model=ProfessionalOut)
async def update_professional(prof_id: str, prof: ProfessionalUpdate):
    db = get_db()
    update_data = {k: v for k, v in prof.dict().items() if v is not None}
    result = await db.professionals.update_one(
        {"_id": ObjectId(prof_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profissional não encontrado")
    updated = await db.professionals.find_one({"_id": ObjectId(prof_id)})
    return serialize(updated)

@router.delete("/{prof_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_professional(prof_id: str):
    db = get_db()
    result = await db.professionals.delete_one({"_id": ObjectId(prof_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Profissional não encontrado")
