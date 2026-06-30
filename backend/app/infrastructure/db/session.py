from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)


class Database:
    def __init__(self, url: str) -> None:
        self._engine = create_async_engine(url, future=True, echo=False)
        self._session_factory = async_sessionmaker(
            self._engine, expire_on_commit=False, class_=AsyncSession
        )

    async def session(self) -> AsyncIterator[AsyncSession]:
        async with self._session_factory() as session:
            yield session

    async def create_all(self, metadata) -> None:
        async with self._engine.begin() as conn:
            await conn.run_sync(metadata.create_all)

    async def drop_all(self, metadata) -> None:
        async with self._engine.begin() as conn:
            await conn.run_sync(metadata.drop_all)

    async def dispose(self) -> None:
        await self._engine.dispose()
