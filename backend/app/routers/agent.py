from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from ..dependencies import get_current_user
from ..agent.orchestrator import process_agent_message

router = APIRouter(prefix="/agent", tags=["Agent"])

class AgentRequest(BaseModel):
    message: str
    chat_history: List[Dict[str, str]] = []
    client_vehicles: Optional[List[Dict[str, Any]]] = []
    context_stations: Optional[List[Dict[str, Any]]] = []
    timezone_offset: Optional[int] = 0  # Offset in minutes (e.g., -120 for GMT+2)

@router.post("/chat")
async def chat_with_agent(request: AgentRequest, current_user: dict = Depends(get_current_user)):
    """
    Stateless endpoint for the frontend component to interact with the LLM Agent.
    """
    try:
        response = await process_agent_message(
            user_message=request.message, 
            chat_history=request.chat_history, 
            user_context=current_user,
            user_vehicles=request.client_vehicles,
            context_stations=request.context_stations,
            timezone_offset=request.timezone_offset
        )
        return response
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
