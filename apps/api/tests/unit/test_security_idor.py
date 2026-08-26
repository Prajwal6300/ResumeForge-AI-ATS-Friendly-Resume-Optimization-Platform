"""
ResumeForge AI - IDOR & Access Control Security Tests
Verifies that User A cannot access, read, modify, delete, or download User B's resources.
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import create_access_token, get_password_hash
from app.models.user import User
from app.parsers.section_extractor import parse_resume_sections


@pytest.mark.asyncio
async def test_user_cannot_access_other_user_resources(
    client: AsyncClient,
    db_session: AsyncSession,
    sample_resume_text: str,
    sample_jd_text: str,
):
    # 1. Create User A and User B
    user_a = User(
        email="usera@example.com",
        hashed_password=get_password_hash("Password123!"),
        full_name="User Alpha",
        is_active=True,
    )
    user_b = User(
        email="userb@example.com",
        hashed_password=get_password_hash("Password123!"),
        full_name="User Beta",
        is_active=True,
    )
    db_session.add_all([user_a, user_b])
    await db_session.commit()
    await db_session.refresh(user_a)
    await db_session.refresh(user_b)

    token_a = create_access_token(subject=user_a.id)
    token_b = create_access_token(subject=user_b.id)
    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 2. User A creates a Resume
    parsed_res = parse_resume_sections(sample_resume_text)
    res_a = await client.post(
        "/api/v1/resumes",
        headers=headers_a,
        json={"title": "User A Resume", "parsed_content": parsed_res.model_dump()},
    )
    assert res_a.status_code == 201
    resume_a_id = res_a.json()["id"]

    # 3. User A creates a Job Description
    jd_a = await client.post(
        "/api/v1/job-descriptions/paste",
        headers=headers_a,
        json={"title": "User A Target Role", "raw_text": sample_jd_text},
    )
    assert jd_a.status_code == 201
    jd_a_id = jd_a.json()["id"]

    # 4. User A creates an Analysis
    analysis_a = await client.post(
        "/api/v1/analyses",
        headers=headers_a,
        json={"resume_id": resume_a_id, "jd_id": jd_a_id},
    )
    assert analysis_a.status_code == 201
    analysis_a_id = analysis_a.json()["id"]

    # 5. User A generates an Export
    export_a = await client.post(
        "/api/v1/exports",
        headers=headers_a,
        json={"resume_id": resume_a_id, "format": "pdf", "template": "classic"},
    )
    assert export_a.status_code == 201
    doc_a_id = export_a.json()["document_id"]

    # --- IDOR CHECKS: User B attempts to access User A's resources ---

    # Try GET User A's Resume
    get_res = await client.get(f"/api/v1/resumes/{resume_a_id}", headers=headers_b)
    assert get_res.status_code == 404

    # Try PUT User A's Resume
    put_res = await client.put(
        f"/api/v1/resumes/{resume_a_id}",
        headers=headers_b,
        json={"title": "Hacked Title"},
    )
    assert put_res.status_code == 404

    # Try DELETE User A's Resume
    del_res = await client.delete(f"/api/v1/resumes/{resume_a_id}", headers=headers_b)
    assert del_res.status_code == 404

    # Try GET User A's Job Description
    get_jd = await client.get(f"/api/v1/job-descriptions/{jd_a_id}", headers=headers_b)
    assert get_jd.status_code == 404

    # Try DELETE User A's Job Description
    del_jd = await client.delete(f"/api/v1/job-descriptions/{jd_a_id}", headers=headers_b)
    assert del_jd.status_code == 404

    # Try GET User A's Analysis
    get_ana = await client.get(f"/api/v1/analyses/{analysis_a_id}", headers=headers_b)
    assert get_ana.status_code == 404

    # Try GET User A's Exported Document Download
    dl_doc = await client.get(f"/api/v1/exports/{doc_a_id}/download", headers=headers_b)
    assert dl_doc.status_code == 404

    # Try GET User A's Resume Versions
    get_versions = await client.get(f"/api/v1/resumes/{resume_a_id}/versions", headers=headers_b)
    assert get_versions.status_code == 404
