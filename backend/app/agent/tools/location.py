import httpx
from typing import Optional, Dict
from langchain_core.tools import tool

@tool
async def tool_geocode_location(query: str) -> Optional[Dict[str, float]]:
    """
    Converts a natural language location (e.g., 'ISBT', 'Connaught Place') into latitude and longitude.
    """
    url = f"https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=1"
    headers = {"User-Agent": "ChargeX-Agent/1.0"}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
    
    if response.status_code==200:
        data = response.json()
        if data:
            return {"lat": float(data[0]["lat"]), "lon": float(data[0]["lon"])}
    return None
