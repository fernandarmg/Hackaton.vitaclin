from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId
from app.database import get_db
from app.schemas.models import UserCreate, UserOut, UserLogin

router = APIRouter()

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    doc.pop("senha", None)   # nunca expõe senha
    return doc

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    db = get_db()
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    result = await db.users.insert_one(user.dict())
    created = await db.users.find_one({"_id": result.inserted_id})
    return serialize(created)

@router.post("/login")
async def login(creds: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": creds.email, "senha": creds.senha})
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    return {
        "id":       str(user["_id"]),
        "nome":     user["nome"],
        "email":    user["email"],
        "role":     user["role"],
        "profNome": user.get("profNome"),
    }

@router.get("/", response_model=List[UserOut])
async def list_users():
    db = get_db()
    cursor = db.users.find()
    return [serialize(doc) async for doc in cursor]

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str):
    db = get_db()
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
