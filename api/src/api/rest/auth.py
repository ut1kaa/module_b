from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel, EmailStr, validator
from src.middlewares.auth import authenticate
from src.models.user import User
from src.database import get_session
from sqlalchemy.future import select

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

@router.post("/registration")
async def register(user: RegisterModel, db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    result = await db.execute(select(User).filter(User.email == user.email))
    existing_user = result.scalars().first()
    
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = User(email=user.email, password=user.password, first_name=user.first_name, last_name=user.last_name)
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    access_token = Authorize.create_access_token(subject=new_user.id)

    return {"token": access_token, "message": "User registered successfully"}


@router.post("/authorization")
async def login(user: LoginModel, db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    result = await db.execute(select(User).filter(User.email == user.email))
    db_user = result.scalars().first()

    if not db_user or not db_user.check_password(user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = Authorize.create_access_token(subject=db_user.id)
    return {"token": access_token, "message": "Login successful"}


@router.get("/logout", dependencies=[Depends(authenticate)])
async def logout(Authorize: AuthJWT = Depends()):
    Authorize.unset_jwt_cookies()
    return {"message": "Logout successful"}


@router.get("/login")
async def login():
    return JSONResponse(
        status_code=403,
        content={"message": "Login failed"}
    )