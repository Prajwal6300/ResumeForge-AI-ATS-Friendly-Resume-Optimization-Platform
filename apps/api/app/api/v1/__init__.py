"""
ResumeForge AI - API v1 Router Aggregator
"""

from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.resumes import router as resumes_router
from app.api.v1.versions import router as versions_router
from app.api.v1.job_descriptions import router as jd_router
from app.api.v1.analyses import router as analyses_router
from app.api.v1.optimization import router as optimization_router
from app.api.v1.exports import router as exports_router

api_v1_router = APIRouter(prefix="/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(resumes_router)
api_v1_router.include_router(versions_router)
api_v1_router.include_router(jd_router)
api_v1_router.include_router(analyses_router)
api_v1_router.include_router(optimization_router)
api_v1_router.include_router(exports_router)
