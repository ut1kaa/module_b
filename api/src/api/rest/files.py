from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_jwt_auth import AuthJWT
from src.middlewares.auth import authenticate
from src.models.file import File as FileModel
from src.models.fileAccess import FileAccess
from src.models.user import User
from src.database import get_session
from pydantic import BaseModel
import os
import shutil
from sqlalchemy.future import select

router = APIRouter()

UPLOAD_DIR = "uploads"

class FileUploadResponse(BaseModel):
    success: bool
    message: str
    file_name: str
    file_url: str
    file_id: int

@router.post("/files", response_model=FileUploadResponse)
async def upload_files(files: UploadFile = File(...), db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()

    allowed_extensions = {'doc', 'pdf', 'docx', 'zip', 'jpeg', 'jpg', 'png'}
    file_extension = files.filename.split('.')[-1].lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File type not allowed")

    if files.size > 2 * 1024 * 1024:  # 2 MB
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File size exceeds 2 MB")

    file_id = int.from_bytes(os.urandom(4), 'big') & 0xFFFFFFFF
    file_name = f"{file_id}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    # Синхронная запись файла на диск
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(files.file, buffer)

    # Асинхронное сохранение в базу данных
    new_file = FileModel(name=files.filename, file_path=file_path, file_id=file_id, user_id=user_id)
    db.add(new_file)
    await db.commit()
    await db.refresh(new_file)

    # Proceed to add file access
    file_access = FileAccess(file_id=new_file.id, user_id=user_id, type='author')
    db.add(file_access)
    await db.commit()

    return {"success": True, "message": "File uploaded", "file_name": files.filename, "file_url": file_path, "file_id": file_id}

@router.patch("/files/{file_id}", dependencies=[Depends(authenticate)])
async def rename_file(file_id: str, new_name: str, db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()

    result = await db.execute(select(FileModel).filter(FileModel.file_id == file_id, FileModel.user_id == user_id))
    file = result.scalars().first()
    
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found or forbidden")

    file.name = new_name
    await db.commit()

    return {"success": True, "message": "File renamed"}

@router.delete("/files/{file_id}", dependencies=[Depends(authenticate)])
async def delete_file(file_id: str, db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()

    result = await db.execute(select(FileModel).filter(FileModel.file_id == file_id, FileModel.user_id == user_id))
    file = result.scalars().first()
    
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    try:
        os.remove(file.file_path)  # Синхронное удаление файла с диска
    except FileNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found on server")

    await db.delete(file)
    await db.commit()

    return {"success": True, "message": "File deleted"}

@router.get("/files/{file_id}", dependencies=[Depends(authenticate)])
async def download_file(file_id: str, db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    result = await db.execute(select(FileModel).filter(FileModel.file_id == file_id))
    file = result.scalars().first()

    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    return FileResponse(file.file_path, media_type="application/octet-stream", filename=file.name)

@router.post("/files/{file_id}/accesses", dependencies=[Depends(authenticate)])
async def add_file_access(file_id: str, email: str, db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()

    result = await db.execute(select(FileModel).filter(FileModel.file_id == file_id, FileModel.user_id == user_id))
    file = result.scalars().first()
    
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found or forbidden")

    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    result = await db.execute(select(FileAccess).filter(FileAccess.file_id == file.file_id, FileAccess.user_id == user.id))
    file_access = result.scalars().first()
    
    if not file_access:
        new_access = FileAccess(file_id=file.file_id, user_id=user.id, type="co-author")
        db.add(new_access)
        await db.commit()

    accesses = await db.execute(select(FileAccess).filter(FileAccess.file_id == file.file_id))
    accesses = accesses.scalars().all()

    response = [{"fullname": f"{acc.user.first_name} {acc.user.last_name}", "email": acc.user.email, "type": acc.type} for acc in accesses]

    return response

@router.delete("/files/{file_id}/accesses", dependencies=[Depends(authenticate)])
async def delete_file_access(file_id: str, email: str, db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()

    result = await db.execute(select(FileModel).filter(FileModel.file_id == file_id, FileModel.user_id == user_id))
    file = result.scalars().first()

    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found or forbidden")

    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if email == Authorize.get_jwt_subject():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot remove your own access")

    result = await db.execute(select(FileAccess).filter(FileAccess.file_id == file.file_id, FileAccess.user_id == user.id))
    access = result.scalars().first()

    if not access:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found in file access list")

    await db.delete(access)
    await db.commit()

    return {"success": True, "message": "Access removed"}

@router.get("/files")
async def get_files(db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()

    result = await db.execute(select(FileModel).filter(FileModel.user_id == user_id))
    files_by_user = result.scalars().all()

    response = []

    for file in files_by_user:
        result = await db.execute(select(FileAccess).filter(FileAccess.file_id == file.file_id))
        accesses_by_file = result.scalars().all()
        
        for access in accesses_by_file:
            result = await db.execute(select(User).filter(User.id == access.user_id))
            user = result.scalars().first()

            if user:
                response.append({
                    'file_id': file.file_id,
                    'name': file.name,
                    'url': file.file_path,
                    'accesses': {
                        'fullname': f"{user.first_name} {user.last_name}",
                        'email': user.email,
                        'type': access.type
                    }
                })

    return response

@router.get("/shared", dependencies=[Depends(authenticate)])
async def get_shared_files(db: AsyncSession = Depends(get_session), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()

    result = await db.execute(select(FileAccess).filter(
        FileAccess.user_id == user_id, 
        FileAccess.type == "co-author"
    ))
    file_accesses_by_user = result.scalars().all()

    shared_files = []
    for access in file_accesses_by_user:
        result = await db.execute(select(FileModel).filter(FileModel.file_id == access.file_id))
        file = result.scalars().first()
        if file:
            shared_files.append({
                'file_id': file.file_id,
                'name': file.name,
                'url': file.file_path
            })

    return shared_files


def explode_url(url: str) -> str:
    parts = url.split('/')
    return parts[-1]
