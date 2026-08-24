"""
ResumeForge AI - Pytest Test Suite Configuration and Fixtures
"""

import asyncio
import os
from typing import AsyncGenerator
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Set test environment
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["SYNC_DATABASE_URL"] = "sqlite:///:memory:"
os.environ["DEFAULT_AI_PROVIDER"] = "mock"
os.environ["SECRET_KEY"] = "test-secret-key-for-unit-testing-purposes-only-32-chars"

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
from app.models.user import User

test_async_engine = create_async_engine(
    "sqlite+aiosqlite:///:memory:",
    connect_args={"check_same_thread": False},
)

TestAsyncSessionLocal = async_sessionmaker(
    bind=test_async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create fresh in-memory database schema for each test."""
    async with test_async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestAsyncSessionLocal() as session:
        yield session

    async with test_async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Provide AsyncClient wired to the test database session."""
    app = create_app()

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def test_user(db_session: AsyncSession) -> User:
    """Create a verified test user."""
    user = User(
        email="candidate@example.com",
        hashed_password=get_password_hash("Password123!"),
        full_name="Alex Mercer",
        is_active=True,
        is_superuser=False,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
def auth_headers(test_user: User) -> dict:
    """Provide valid authorization headers for test user."""
    token = create_access_token(subject=test_user.id)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def sample_resume_text() -> str:
    return """
Alex Mercer
alex.mercer@example.com | (555) 123-4567 | San Francisco, CA | linkedin.com/in/alexmercer | github.com/alexmercer

Professional Summary
Senior Full-Stack Engineer with 5+ years of experience designing and scaling distributed web applications with Python, FastAPI, React, and PostgreSQL.

Technical Skills
Languages: Python, JavaScript, TypeScript, SQL, HTML, CSS
Frameworks: FastAPI, React, Next.js, Django, Node.js
Cloud & DevOps: Docker, Kubernetes, AWS, CI/CD, Git, PostgreSQL, Redis

Work Experience
Senior Software Engineer | CloudTech Solutions
Jan 2022 - Present
- Architected microservices with FastAPI and PostgreSQL, reducing query latency by 45%.
- Led frontend modernization using Next.js and Tailwind CSS, increasing page load speed by 35%.
- Spearheaded CI/CD automation pipeline using GitHub Actions, decreasing release cycle times from 2 days to 30 minutes.

Software Engineer | NextGen Systems
Jun 2019 - Dec 2021
- Developed RESTful APIs using Python and Django supporting over 500k monthly active users.
- Built real-time analytics dashboard with React and WebSockets.
- Optimized database indexing and Redis caching layer.

Education
Bachelor of Science in Computer Science
University of California, Berkeley (2015 - 2019)
GPA: 3.8/4.0

Certifications
- AWS Certified Solutions Architect - Associate
"""


@pytest.fixture
def sample_jd_text() -> str:
    return """
Senior Full-Stack Engineer

About the Role:
We are looking for a Senior Full-Stack Engineer to lead development of our cloud platform.

Responsibilities:
- Design and architect scalable backend services using Python and FastAPI.
- Build responsive user interfaces using React, TypeScript, and modern CSS.
- Optimize PostgreSQL database performance and Redis caching.
- Collaborate with product and design teams in an Agile/Scrum environment.
- Automate deployment pipelines using Docker and Kubernetes in AWS.

Qualifications & Requirements:
- 4+ years of professional full-stack development experience.
- Strong proficiency in Python, FastAPI, and PostgreSQL.
- Solid experience with React, TypeScript, and Tailwind CSS.
- Experience with Docker, Kubernetes, AWS, and CI/CD pipelines.
- Knowledge of GraphQL and Kafka is a plus.
- Excellent communication and problem-solving skills.
"""
