from abc import ABC, abstractmethod
from typing import BinaryIO
from uuid import UUID

from app.domain.entities import GeneratedPost, UploadedFile
from app.domain.value_objects import Platform, RefineAction


class ObjectStorage(ABC):
    @abstractmethod
    async def put(
        self,
        key: str,
        data: BinaryIO,
        size: int,
        content_type: str,
    ) -> None: ...

    @abstractmethod
    async def presigned_get_url(self, key: str, expires_seconds: int = 3600) -> str: ...

    @abstractmethod
    async def delete(self, key: str) -> None: ...


class FileRepository(ABC):
    @abstractmethod
    async def add(self, file: UploadedFile) -> None: ...

    @abstractmethod
    async def get(self, file_id: UUID) -> UploadedFile | None: ...

    @abstractmethod
    async def list_recent(self, limit: int = 50) -> list[UploadedFile]: ...

    @abstractmethod
    async def delete(self, file_id: UUID) -> bool: ...


class ContentGenerator(ABC):
    @abstractmethod
    async def generate(
        self,
        platform: Platform,
        raw_text: str,
        image_urls: list[str],
    ) -> GeneratedPost: ...

    @abstractmethod
    async def refine(
        self,
        platform: Platform,
        text: str,
        action: RefineAction,
    ) -> GeneratedPost: ...
