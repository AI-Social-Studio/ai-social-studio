from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.ports import DraftRepository, FileRepository
from app.domain.entities import Draft, UploadedFile
from app.domain.value_objects import ImageContentType, Platform
from app.infrastructure.db.models import DraftModel, UploadedFileModel


class SqlAlchemyFileRepository(FileRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, file: UploadedFile) -> None:
        assert file.content_type is not None
        model = UploadedFileModel(
            id=file.id,
            original_filename=file.original_filename,
            storage_key=file.storage_key,
            content_type=file.content_type.value,
            extension=file.content_type.extension,
            size_bytes=file.size_bytes,
            created_at=file.created_at,
        )
        self._session.add(model)
        await self._session.commit()

    async def get(self, file_id: UUID) -> UploadedFile | None:
        result = await self._session.execute(
            select(UploadedFileModel).where(UploadedFileModel.id == file_id)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def list_recent(self, limit: int = 50) -> list[UploadedFile]:
        result = await self._session.execute(
            select(UploadedFileModel)
            .order_by(UploadedFileModel.created_at.desc())
            .limit(limit)
        )
        return [self._to_entity(m) for m in result.scalars().all()]

    async def delete(self, file_id: UUID) -> bool:
        result = await self._session.execute(
            delete(UploadedFileModel).where(UploadedFileModel.id == file_id)
        )
        await self._session.commit()
        return result.rowcount > 0

    @staticmethod
    def _to_entity(model: UploadedFileModel) -> UploadedFile:
        return UploadedFile(
            id=model.id,
            original_filename=model.original_filename,
            storage_key=model.storage_key,
            content_type=ImageContentType(value=model.content_type, extension=model.extension),
            size_bytes=model.size_bytes,
            created_at=model.created_at,
        )


class SqlAlchemyDraftRepository(DraftRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, draft: Draft) -> None:
        self._session.add(self._to_model(draft))
        await self._session.commit()

    async def update(self, draft: Draft) -> bool:
        model = await self._session.get(DraftModel, draft.id)
        if model is None:
            return False

        model.title = draft.title
        model.raw_text = draft.raw_text
        model.selected_platforms = [platform.value for platform in draft.selected_platforms]
        model.posts = {platform.value: text for platform, text in draft.posts.items()}
        model.file_ids = [str(file_id) for file_id in draft.file_ids]
        model.updated_at = datetime.now(timezone.utc)
        await self._session.commit()
        return True

    async def get(self, draft_id: UUID) -> Draft | None:
        model = await self._session.get(DraftModel, draft_id)
        return self._to_draft(model) if model else None

    async def list_recent(self, limit: int = 50) -> list[Draft]:
        result = await self._session.execute(
            select(DraftModel).order_by(DraftModel.updated_at.desc()).limit(limit)
        )
        return [self._to_draft(model) for model in result.scalars().all()]

    @staticmethod
    def _to_model(draft: Draft) -> DraftModel:
        return DraftModel(
            id=draft.id,
            title=draft.title,
            raw_text=draft.raw_text,
            selected_platforms=[platform.value for platform in draft.selected_platforms],
            posts={platform.value: text for platform, text in draft.posts.items()},
            file_ids=[str(file_id) for file_id in draft.file_ids],
            created_at=draft.created_at,
            updated_at=draft.updated_at,
        )

    @staticmethod
    def _to_draft(model: DraftModel) -> Draft:
        return Draft(
            id=model.id,
            title=model.title,
            raw_text=model.raw_text,
            selected_platforms=[Platform(platform) for platform in model.selected_platforms],
            posts={Platform(platform): text for platform, text in model.posts.items()},
            file_ids=[UUID(file_id) for file_id in model.file_ids],
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

