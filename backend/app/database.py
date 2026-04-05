import motor.motor_asyncio
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME",   "vitaclin")

client: motor.motor_asyncio.AsyncIOMotorClient = None
db = None

async def connect_db():
    global client, db
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    print(f"Conectado ao MongoDB: {DB_NAME}")

async def close_db():
    global client
    if client:
        client.close()

def get_db():
    return db

def str_to_oid(id: str) -> ObjectId:
    return ObjectId(id)
