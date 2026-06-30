from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import UUID, uuid4

from .value_objects import ImageContentType, Platform


@dataclass
class UploadedFile:
    id: UUID = field(default_factory=uuid4)
    original_filename: str = ""
    storage_key: str = ""
    content_type: ImageContentType | None = None
    size_bytes: int = 0
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class GeneratedPost:
    platform: Platform
    text: str
