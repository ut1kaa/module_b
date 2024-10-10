from typing import Annotated, AsyncIterator

from fastapi import Depends
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession

from src.settings import settings


async_engine = create_async_engine(
    settings.DB_URL,
    pool_pre_ping=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    autoflush=False,
    future=True,
)

# async def get_session() -> AsyncIterator[async_sessionmaker]:
#     try:
#         yield AsyncSessionLocal
#     except SQLAlchemyError as e:
#         from src.run import LOGGER
#         LOGGER.exception(e)


# AsyncSession = Annotated[async_sessionmaker, Depends(get_session)]


async def get_session() -> AsyncIterator[AsyncSession]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except SQLAlchemyError as e:
            from src.run import LOGGER
            LOGGER.exception(e)
            # raise HTTPException(status_code=500, detail="Database error")

# Dependency для получения сессии
AsyncSessionDep = Annotated[AsyncSession, Depends(get_session)]