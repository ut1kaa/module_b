from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel, EmailStr, validator
from src.models import User
from src.database import AsyncSessionDep

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegisterModel(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

    @validator('first_name', 'last_name', 'email')
    def trim_string(cls, value: str) -> str:
        return value.strip()

class LoginModel(BaseModel):
    email: EmailStr
    password: str

    @validator('email')
    def trim_string(cls, value: str) -> str:
        return value.strip()

@router.post("/register")
async def register(user: RegisterModel, db: Session = Depends(AsyncSessionDep), Authorize: AuthJWT = Depends()):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, password_hash=hashed_password, first_name=user.first_name, last_name=user.last_name)
    db.add(new_user)
    db.commit()

    access_token = Authorize.create_access_token(subject=new_user.id)
    return {"token": access_token, "message": "User registered successfully"}

@router.post("/login")
async def login(user: LoginModel, db: Session = Depends(AsyncSessionDep), Authorize: AuthJWT = Depends()):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = Authorize.create_access_token(subject=db_user.id)
    return {"token": access_token, "message": "Login successful"}

@router.post("/logout")
async def logout(Authorize: AuthJWT = Depends()):
    Authorize.unset_jwt_cookies()
    return {"message": "Logout successful"}
