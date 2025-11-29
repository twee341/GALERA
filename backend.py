import asyncio
import datetime
import os

from fastapi.middleware.cors import CORSMiddleware
from fastapi import (
    FastAPI,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.responses import JSONResponse
import uvicorn
from db_requests import db

app = FastAPI()
connected_clients: list[WebSocket] = []
light_observers = []

@app.get("/item/")
async def read_item():
    return JSONResponse(await db.get_accidents())


@app.post("/event")
async def event(location_id: int, accident_type: str):
    'receives ongoing data from BCI and analyzes it'
    timestamp = datetime.datetime.now().isoformat()
    
    