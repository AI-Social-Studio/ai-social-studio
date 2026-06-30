from fastapi import APIRouter

from app.interface.api.v1 import generate, uploads

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(uploads.router)
api_router.include_router(generate.router)
