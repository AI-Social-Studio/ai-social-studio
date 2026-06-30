from dataclasses import dataclass
from enum import StrEnum

from .exceptions import UnsupportedFileTypeError


class Platform(StrEnum):
    LINKEDIN = "linkedin"
    INSTAGRAM = "instagram"
    X = "x"

    @property
    def char_limit(self) -> int:
        return _PLATFORM_CHAR_LIMITS[self]


_PLATFORM_CHAR_LIMITS: dict[Platform, int] = {
    Platform.LINKEDIN: 3000,
    Platform.INSTAGRAM: 2200,
    Platform.X: 280,
}


class RefineAction(StrEnum):
    HOOK = "hook"
    SHORTEN = "shorten"
    FORMAL = "formal"
    CASUAL = "casual"
    CTA = "cta"
    HASHTAGS = "hashtags"


ALLOWED_IMAGE_TYPES: dict[str, str] = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/heic": "heic",
    "image/heif": "heif",
}


@dataclass(frozen=True)
class ImageContentType:
    value: str
    extension: str

    @classmethod
    def from_mime(cls, mime: str, filename: str) -> "ImageContentType":
        normalized = mime.lower().split(";")[0].strip()
        ext = ALLOWED_IMAGE_TYPES.get(normalized)
        if ext is None:
            raise UnsupportedFileTypeError(filename=filename, content_type=mime)
        return cls(value=normalized, extension=ext)
