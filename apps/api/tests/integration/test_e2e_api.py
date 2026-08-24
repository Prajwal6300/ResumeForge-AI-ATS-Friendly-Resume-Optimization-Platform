"""
ResumeForge AI - End-to-End Workflow Integration Test
Validates complete user journey from registration to ATS analysis, optimization, versioning, and export.
"""

import pytest
from httpx import AsyncClient
from app.schemas.resume import StructuredResumeContent


@pytest.mark.asyncio
async def test_complete_end_to_end_user_journey(
    client: AsyncClient,
    sample_resume_text: str,
    sample_jd_text: str,
):
    # Step 1: User Registration
    reg_res = await client.post(
        "/api/v1/auth/register",
        json={"email": "e2e_user@example.com", "password": "Password123!", "full_name": "Alex Mercer"},
    )
    assert reg_res.status_code == 201
    auth_data = reg_res.json()
    token = auth_data["tokens"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Step 2: Create / Paste Job Description
    jd_res = await client.post(
        "/api/v1/job-descriptions/paste",
        headers=headers,
        json={
            "title": "Senior Full-Stack Engineer",
            "company": "CloudTech Corp",
            "raw_text": sample_jd_text,
        },
    )
    assert jd_res.status_code == 201
    jd_data = jd_res.json()
    jd_id = jd_data["id"]
    assert "Python" in jd_data["structured_content"]["required_skills"] or "python" in [s.lower() for s in jd_data["structured_content"]["required_skills"]]

    # Step 3: Create Resume
    from app.parsers.section_extractor import parse_resume_sections
    struct_content = parse_resume_sections(sample_resume_text)

    res_create = await client.post(
        "/api/v1/resumes",
        headers=headers,
        json={
            "title": "Alex Mercer - Full Stack",
            "parsed_content": struct_content.model_dump(),
            "raw_text": sample_resume_text,
        },
    )
    assert res_create.status_code == 201
    resume_data = res_create.json()
    resume_id = resume_data["id"]
    assert resume_data["parsed_content"]["personal"]["name"] == "Alex Mercer"

    # Step 4: Trigger ATS Analysis
    analysis_res = await client.post(
        "/api/v1/analyses",
        headers=headers,
        json={"resume_id": resume_id, "jd_id": jd_id},
    )
    assert analysis_res.status_code == 201
    analysis_data = analysis_res.json()
    assert 0.0 <= analysis_data["overall_score"] <= 100.0
    assert "keyword_relevance" in analysis_data["breakdown"]
    assert len(analysis_data["matched_keywords"]) > 0
    assert len(analysis_data["recommendations"]) > 0

    # Step 5: Ask AI to Improve Summary Section
    improve_res = await client.post(
        "/api/v1/optimization/section",
        headers=headers,
        json={
            "resume_id": resume_id,
            "section": "summary",
            "current_content": struct_content.summary,
            "jd_id": jd_id,
            "goal": "jd_align",
        },
    )
    assert improve_res.status_code == 200
    improve_data = improve_res.json()
    assert improve_data["improved_text"]
    assert "Verified" in improve_data["anti_fabrication_notice"]

    # Step 6: Ask AI to Rewrite a Bullet Point
    bullet_res = await client.post(
        "/api/v1/optimization/bullet",
        headers=headers,
        json={
            "resume_id": resume_id,
            "original_bullet": "Worked on backend APIs in python",
            "jd_id": jd_id,
            "goal": "impact",
        },
    )
    assert bullet_res.status_code == 200
    bullet_data = bullet_res.json()
    assert bullet_data["suggested_bullet"]

    # Step 7: Update Resume and Trigger Versioning
    updated_content = struct_content.model_dump()
    updated_content["summary"] = improve_data["improved_text"]
    update_res = await client.put(
        f"/api/v1/resumes/{resume_id}",
        headers=headers,
        json={
            "parsed_content": updated_content,
            "change_summary": "Applied AI summary improvements",
        },
    )
    assert update_res.status_code == 200
    assert update_res.json()["version_count"] >= 2

    # Step 8: View Version History & Restore Version 1
    versions_res = await client.get(f"/api/v1/resumes/{resume_id}/versions", headers=headers)
    assert versions_res.status_code == 200
    versions_list = versions_res.json()
    assert len(versions_list) >= 2
    v1_id = versions_list[-1]["id"]  # Oldest version

    restore_res = await client.post(
        f"/api/v1/resumes/{resume_id}/versions/{v1_id}/restore",
        headers=headers,
    )
    assert restore_res.status_code == 200

    # Step 9: Export PDF Resume
    export_pdf_res = await client.post(
        "/api/v1/exports",
        headers=headers,
        json={"resume_id": resume_id, "format": "pdf", "template": "classic"},
    )
    assert export_pdf_res.status_code == 201
    doc_id = export_pdf_res.json()["document_id"]

    # Step 10: Download Exported PDF
    dl_res = await client.get(f"/api/v1/exports/{doc_id}/download", headers=headers)
    assert dl_res.status_code == 200
    assert dl_res.headers["content-type"] == "application/pdf"
    assert len(dl_res.content) > 500

    # Step 11: Export DOCX Resume
    export_docx_res = await client.post(
        "/api/v1/exports",
        headers=headers,
        json={"resume_id": resume_id, "format": "docx", "template": "professional"},
    )
    assert export_docx_res.status_code == 201
    docx_doc_id = export_docx_res.json()["document_id"]

    # Step 12: Download Exported DOCX
    dl_docx = await client.get(f"/api/v1/exports/{docx_doc_id}/download", headers=headers)
    assert dl_docx.status_code == 200
    assert len(dl_docx.content) > 500
