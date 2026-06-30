from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


PlatformLiteral = Literal["linkedin", "instagram", "x"]
RefineActionLiteral = Literal["hook", "shorten", "formal", "casual", "cta", "hashtags"]


class UploadedFileResponse(BaseModel):
    id: UUID
    filename: str = Field(..., description="Original filename provided by client")
    content_type: str
    size_bytes: int
    url: str = Field(..., description="Presigned GET URL valid for 1 hour")
    created_at: datetime


class UploadResponse(BaseModel):
    files: list[UploadedFileResponse]


class ErrorResponse(BaseModel):
    detail: str
    code: str


class GenerateRequest(BaseModel):
    raw: str = Field(default="", description="Brudnopis użytkownika (PL)")
    platforms: list[PlatformLiteral] = Field(
        ..., min_length=1, description="linkedin | instagram | x"
    )
    file_ids: list[UUID] = Field(default_factory=list)


class GenerateResponse(BaseModel):
    posts: dict[str, str] = Field(
        default_factory=dict,
        description="Mapa platform -> gotowy post (PL, z \\n\\n, hashtagi w ostatniej linii)",
    )
    errors: dict[str, str] = Field(
        default_factory=dict,
        description="Mapa platform -> komunikat błędu (gdy generacja danej platformy padła)",
    )


class RefineRequest(BaseModel):
    platform: PlatformLiteral
    text: str = Field(..., min_length=1)
    action: RefineActionLiteral


class RefineResponse(BaseModel):
    text: str


class SaveDraftRequest(BaseModel):
    title: str = Field(default="", max_length=120)
    raw: str = Field(default="")
    platforms: list[PlatformLiteral] = Field(default_factory=list)
    posts: dict[str, str] = Field(default_factory=dict)
    file_ids: list[UUID] = Field(default_factory=list)


class DraftSummaryResponse(BaseModel):
    id: UUID
    title: str
    selected_platforms: list[PlatformLiteral]
    posts_count: int
    raw_text_preview: str
    updated_at: datetime
    created_at: datetime


class DraftResponse(BaseModel):
    id: UUID
    title: str
    raw: str
    platforms: list[PlatformLiteral]
    posts: dict[str, str]
    file_ids: list[UUID]
    created_at: datetime
    updated_at: datetime
    files: list[UploadedFileResponse]
