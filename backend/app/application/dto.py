from dataclasses import dataclass
from datetime import datetime
from typing import BinaryIO
from uuid import UUID


@dataclass
class IncomingFile:
    filename: str
    content_type: str
    size: int
    stream: BinaryIO


@dataclass
class UploadedFileView:
    id: UUID
    original_filename: str
    content_type: str
    size_bytes: int
    url: str
    created_at: datetime


@dataclass
class GenerateResultView:
    posts: dict[str, str]
    errors: dict[str, str]


@dataclass
class DraftSummaryView:
    id: UUID
    title: str
    selected_platforms: list[str]
    posts_count: int
    raw_text_preview: str
    updated_at: datetime
    created_at: datetime


@dataclass
class DraftView:
    id: UUID
    title: str
    raw_text: str
    selected_platforms: list[str]
    posts: dict[str, str]
    file_ids: list[UUID]
    created_at: datetime
    updated_at: datetime
    files: list[UploadedFileView]
