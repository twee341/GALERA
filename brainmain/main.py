import asyncio
import threading
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware

try:
    from stream import run_eeg_acquisition
    from config import *
except ImportError:
    print("⚠️ Warning: 'stream' or 'config' modules not found. Running in mock mode might fail.")


    def run_eeg_acquisition():
        pass

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients: list[WebSocket] = []
eeg_thread = None
activate = False


@app.get("/startup")
async def read_item():
    global activate, eeg_thread
    if eeg_thread is not None and eeg_thread.is_alive():
        return {"status": "already running"}

    activate = True
    eeg_thread = threading.Thread(target=run_eeg_acquisition)
    eeg_thread.daemon = True
    eeg_thread.start()
    return {"status": "EEG session started"}


@app.get("/shutdown")
async def shutdown():
    global activate, eeg_thread
    activate = False
    if eeg_thread is not None:
        eeg_thread.join(timeout=2.0)
        eeg_thread = None
    return {"status": "EEG session stopped"}

@app.post("/send_stats")
async def event(request: Request):
    try:
        data = await request.json()  # Принудительно читаем JSON

        # Рассылаем данные всем подключенным вебсокетам
        if connected_clients:
            for client in connected_clients[:]:
                try:
                    await client.send_json(data)
                except Exception as e:
                    print(f"Error sending to client: {e}")
                    if client in connected_clients:
                        connected_clients.remove(client)
        return {"status": "ok"}
    except Exception as e:
        print(f"❌ Error processing stats: {e}")
        return {"status": "error", "detail": str(e)}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    print(f"✅ Client connected. Total clients: {len(connected_clients)}")

    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("❌ Client disconnected")
        if websocket in connected_clients:
            connected_clients.remove(websocket)
    except Exception as e:
        print(f"⚠️ WebSocket Error: {e}")
        if websocket in connected_clients:
            connected_clients.remove(websocket)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)