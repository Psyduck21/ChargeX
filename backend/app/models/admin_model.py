from pydantic import BaseModel, EmailStr
from typing import Optional


class AdminBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None


class AdminCreate(AdminBase):
    pass


class AdminUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class AdminOut(AdminBase):
    id: str

    class Config:
        from_attributes = True
