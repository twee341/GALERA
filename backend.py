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

    # check if event is an incident
    if(location_id == -1):
        await sendMessageToClients(
            {"location_id": -1, "accident_type": accident_type})
        return
