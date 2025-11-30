import asyncio
import datetime
import os
import threading
import requests
from fastapi.middleware.cors import CORSMiddleware
from fastapi import (
    FastAPI,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.responses import JSONResponse
import uvicorn
from db_requests import db
from stream import run_eeg_acquisition
from config import *
app = FastAPI()
connected_clients: list[WebSocket] = []




@app.get("/startup/")
async def read_item():
    global activate, eeg_thread
    
    if eeg_thread is not None and eeg_thread.is_alive():
        return {"status": "already running"}

    activate = True
    eeg_thread = threading.Thread(target=run_eeg_acquisition )
    eeg_thread.daemon = True
    eeg_thread.start()
    return {"status": "EEG session started"}


@app.get("/shutdown/")
async def shutdown():
    global activate, eeg_thread
    
    activate = False
    if eeg_thread is not None:
        eeg_thread.join()
        eeg_thread = None
    return {"status": "EEG session stopped"}

@app.post("/send_stats")
async def event(data: dict):
    for client in connected_clients:
        try:
            await client.send_json(data)
        except Exception as e:
            print("Error sending to client:", e)
    



"""

async def sendMessageToClients(message):
    to_remove = []
    for ws in connected_clients:
        try:
            await ws.send_json({"message": message})
        except Exception as e:
            print("Error sending to client:", e)
            to_remove.append(ws)

    # Clean up broken connections
    for ws in to_remove:
        connected_clients.remove(ws)
"""

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()
    connected_clients.append(websocket)

    try:
        while True:
            await websocket.receive_text()  # optional, can remove if you want
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        print("❌ Client disconnected")
    except Exception as e:
        print("⚠️ Error:", e)
        if websocket in connected_clients:
            connected_clients.remove(websocket)
        await websocket.close()


async def fas():
    conf = uvicorn.Config("main:app", host="127.0.0.1", port=8000, reload=True)
    server = uvicorn.Server(conf)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(fas())
