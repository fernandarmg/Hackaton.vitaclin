from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from bson import ObjectId
from app.database import get_db
from app.schemas.models import FinanceCreate, FinanceUpdate, FinanceOut

router = APIRouter()

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.post("/", response_model=FinanceOut, status_code=status.HTTP_201_CREATED)
async def create_finance(item: FinanceCreate):
    db = get_db()
    result = await db.finances.insert_one(item.dict())
    created = await db.finances.find_one({"_id": result.inserted_id})
    return serialize(created)

@router.get("/", response_model=List[FinanceOut])
async def list_finances(
    status: Optional[str] = Query(None),
    prof:   Optional[str] = Query(None),
    plano:  Optional[str] = Query(None),
    svc:    Optional[str] = Query(None),
):
    db = get_db()
    query = {}
    if status: query["status"] = status
    if prof:   query["prof"]   = prof
    if plano:  query["plano"]  = plano
    if svc:    query["svc"]    = svc
    cursor = db.finances.find(query).sort("data", -1)
    return [serialize(doc) async for doc in cursor]

@router.get("/summary", tags=["Financeiro"])
async def finance_summary():
    """Resumo financeiro: total pago, pendente, por especialidade."""
    db = get_db()
    pipeline = [
        {"$group": {
            "_id": "$status",
            "total": {"$sum": "$valor"},
            "count": {"$sum": 1}
        }}
    ]
    result = {}
    async for doc in db.finances.aggregate(pipeline):
        result[doc["_id"]] = {"total": doc["total"], "count": doc["count"]}
    return result

@router.get("/{item_id}", response_model=FinanceOut)
async def get_finance(item_id: str):
    db = get_db()
    doc = await db.finances.find_one({"_id": ObjectId(item_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    return serialize(doc)

@router.put("/{item_id}", response_model=FinanceOut)
async def update_finance(item_id: str, item: FinanceUpdate):
    db = get_db()
    update_data = {k: v for k, v in item.dict().items() if v is not None}
    result = await db.finances.update_one(
        {"_id": ObjectId(item_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    updated = await db.finances.find_one({"_id": ObjectId(item_id)})
    return serialize(updated)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_finance(item_id: str):
    db = get_db()
    result = await db.finances.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
