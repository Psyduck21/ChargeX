from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from ..dependencies import require_admin
from ..crud import list_station_managers, create_station_manager

router = APIRouter(prefix="/station_managers", tags=["StationManagers"])


@router.get("/", dependencies=[Depends(require_admin)])
def read_all_managers() -> List[Dict[str, Any]]:
    """
    List all station managers.
    Only accessible by admins.
    """
    return list_station_managers()


@router.post("/", dependencies=[Depends(require_admin)])
def add_station_manager(manager: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new station manager.
    Expects a JSON object with fields like:
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "station_ids": ["uuid1", "uuid2"]
    }
    """
    if not manager.get("name") or not manager.get("email"):
        raise HTTPException(status_code=400, detail="Missing required fields: name or email")
    
    return create_station_manager(manager)
