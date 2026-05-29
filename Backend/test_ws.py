import asyncio
import websockets

async def test_ws():
    try:
        async with websockets.connect("ws://localhost:8001/ws/pose", additional_headers={"Origin": "http://localhost:3000"}) as ws:
            print("Connected successfully to 8001!")
            response = await ws.recv()
            print("Received:", response)
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test_ws())
