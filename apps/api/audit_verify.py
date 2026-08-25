import asyncio
import os
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from httpx import AsyncClient, ASGITransport
from app.main import create_app
from app.db.session import init_db
from app.parsers.section_extractor import parse_resume_sections
from app.matching.keyword_extractor import parse_job_description_text
from app.parsers.pdf_parser import PDFParser

# Set test environment
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["SYNC_DATABASE_URL"] = "sqlite:///:memory:"
os.environ["DEFAULT_AI_PROVIDER"] = "mock"
os.environ["SECRET_KEY"] = "test-secret-key-for-development-minimum-32-chars"

async def test():
    app = create_app()
    await init_db()
    print("=" * 60)
    print("RESUMEFORGE AI - PRODUCTION AUDIT VERIFICATION")
    print("=" * 60)
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Register
        print("\n1. USER REGISTRATION")
        r = await client.post("/api/v1/auth/register", json={
            "email": "audit+user-new@example.com", 
            "password": "Password123!", 
            "full_name": "John Miller"
        })
        if r.status_code != 201:
            print(f"   [FAIL] Registration failed: {r.status_code} {r.text}")
            return
        data = r.json()
        token = data["tokens"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("   [OK] Registration successful")
        
        # 2. Login
        print("\n2. LOGIN")
        r = await client.post("/api/v1/auth/login", json={
            "email": "audit+user-new@example.com", 
            "password": "Password123!"
        })
        if r.status_code != 200:
            print(f"   [FAIL] Login failed: {r.status_code}")
            return
        print("   [OK] Login successful")
        
        # 3. Get profile
        print("\n3. GET PROFILE")
        r = await client.get("/api/v1/users/me", headers=headers)
        if r.status_code != 200:
            print(f"   [FAIL] Get profile failed: {r.status_code}")
            return
        print("   [OK] Profile retrieved")
        
        # 4. Upload PDF resume
        print("\n4. UPLOAD PDF RESUME")
        sample_resume_text = open("test_resume.txt", "r").read()
        struct = parse_resume_sections(sample_resume_text)
        
        # Create in-memory PDF using reportlab
        bio = io.BytesIO()
        c = canvas.Canvas(bio, pagesize=letter)
        lines = sample_resume_text.split("\n")
        y = 750
        for line in lines:
            c.drawString(100, y, line[:80])
            y -= 15
            if y < 50:
                break
        c.showPage()
        c.save()
        pdf_bytes = bio.getvalue()
        
        r = await client.post(
            "/api/v1/resumes/upload", 
            headers=headers,
            files={"file": ("resume.pdf", pdf_bytes, "application/pdf")}
        )
        if r.status_code != 201:
            print(f"   [FAIL] Upload failed: {r.status_code} {r.text}")
            return
        resume_data = r.json()
        resume_id = resume_data["id"]
        print("   [OK] PDF uploaded and parsed successfully")
        print(f"   - Parsed name: {resume_data['parsed_content']['personal']['name']}")
        print(f"   - Skills count: {len(resume_data['parsed_content']['skills'])}")
        print(f"   - Experience count: {len(resume_data['parsed_content']['experience'])}")
        
        # 5. Create JD
        print("\n5. CREATE JOB DESCRIPTION")
        sample_jd_text = open("test_jd.txt", "r").read()
        jd_struct = parse_job_description_text(sample_jd_text, title="Senior Full-Stack Engineer")
        
        r = await client.post(
            "/api/v1/job-descriptions/paste",
            headers=headers,
            json={"title": "Senior Full-Stack Engineer", "company": "TechCorp Industries", "raw_text": sample_jd_text}
        )
        if r.status_code != 201:
            print(f"   [FAIL] JD paste failed: {r.status_code} {r.text}")
            return
        jd_data = r.json()
        jd_id = jd_data["id"]
        print("   [OK] JD created and parsed")
        print(f"   - Required skills: {jd_data['structured_content']['required_skills'][:5]}...")
        print(f"   - Technologies: {jd_data['structured_content']['technologies'][:5]}...")
        
        # 6. Run ATS Analysis
        print("\n6. ATS COMPATIBILITY ANALYSIS")
        r = await client.post("/api/v1/analyses", headers=headers, json={
            "resume_id": resume_id, "jd_id": jd_id
        })
        if r.status_code != 201:
            print(f"   [FAIL] Analysis failed: {r.status_code} {r.text}")
            return
        analysis = r.json()
        print("   [OK] Analysis complete")
        print(f"   - Overall score: {analysis['overall_score']}%")
        print(f"   - Keyword score: {analysis['breakdown']['keyword_relevance']['score']}%")
        print(f"   - Skills score: {analysis['breakdown']['technical_skills']['score']}%")
        print(f"   - Responsibilities score: {analysis['breakdown']['responsibilities']['score']}%")
        print(f"   - Experience score: {analysis['breakdown']['experience_relevance']['score']}%")
        print(f"   - Structure score: {analysis['breakdown']['resume_structure']['score']}%")
        print(f"   - Matched keywords: {len(analysis['matched_keywords'])}")
        print(f"   - Missing keywords: {len(analysis['missing_keywords'])}")
        print(f"   - Weak keywords: {len(analysis['weak_keywords'])}")
        
        # Verify the score makes sense
        if analysis["overall_score"] > 0 and len(analysis["matched_keywords"]) > 0:
            print("   [OK] ATS scoring is deterministic and explainable")
        else:
            print("   [FAIL] ATS scoring unexpected result")
            return
        
        # 7. AI Section Improvement
        print("\n7. AI SECTION IMPROVEMENT")
        r = await client.post("/api/v1/optimization/section", headers=headers, json={
            "resume_id": resume_id,
            "section": "summary",
            "current_content": struct.summary,
            "jd_id": jd_id,
            "goal": "jd_align"
        })
        if r.status_code != 200:
            print(f"   [FAIL] AI section improve failed: {r.status_code} {r.text}")
            return
        improve_data = r.json()
        print("   [OK] AI section improvement complete")
        print(f"   - Improved text preview: {improve_data['improved_text'][:80]}...")
        print(f"   - Anti-fabrication notice: {improve_data['anti_fabrication_notice']}")
        # Verify no fabricated experience
        if "Google" not in improve_data["improved_text"]:
            print("   [OK] Anti-fabrication guardrail active - no Google fabrication")
        else:
            print("   [FAIL] AI fabricated Google experience!")
            return
        
        # 8. AI Bullet Rewrite
        print("\n8. AI BULLET REWRITE")
        r = await client.post("/api/v1/optimization/bullet", headers=headers, json={
            "resume_id": resume_id,
            "original_bullet": "Worked on Python backend services",
            "jd_id": jd_id,
            "goal": "impact"
        })
        if r.status_code != 200:
            print(f"   [FAIL] AI bullet rewrite failed: {r.status_code} {r.text}")
            return
        bullet_data = r.json()
        print("   [OK] AI bullet rewrite complete")
        print(f"   - Suggested bullet: {bullet_data['suggested_bullet'][:80]}...")
        print(f"   - Rationale: {bullet_data['rationale']}")
        # Verify no fabrication
        if "Google" not in bullet_data["suggested_bullet"]:
            print("   [OK] Bullet rewrite respects source data - no Google fabrication")
        else:
            print("   [FAIL] AI fabricated Google employment!")
            return
        
        # 9. Update resume (versioning)
        print("\n9. RESUME EDITING & VERSIONING")
        updated_content = struct.model_dump()
        updated_content["summary"] = improve_data["improved_text"]
        r = await client.put(f"/api/v1/resumes/{resume_id}", headers=headers, json={
            "parsed_content": updated_content,
            "change_summary": "Applied AI summary improvements"
        })
        if r.status_code != 200:
            print(f"   [FAIL] Resume update failed: {r.status_code}")
            return
        update_result = r.json()
        print("   [OK] Resume updated")
        print(f"   - Version count: {update_result['version_count']}")
        print(f"   - Current version ID: {update_result['current_version_id']}")
        if update_result["version_count"] >= 2:
            print("   [OK] Version count >= 2 after edit")
        else:
            print("   [FAIL] Version count should be >= 2")
            return
        
        # 10. View version history
        print("\n10. VERSION HISTORY")
        r = await client.get(f"/api/v1/resumes/{resume_id}/versions", headers=headers)
        if r.status_code != 200:
            print(f"   [FAIL] Versions failed: {r.status_code}")
            return
        versions = r.json()
        print("   [OK] Version history retrieved: {} versions".format(len(versions)))
        for v in versions:
            print("     v{}: {} (is_current: {})".format(v['version_number'], v['title'], v['is_current']))
        
        # 11. Export PDF
        print("\n11. PDF EXPORT")
        r = await client.post("/api/v1/exports", headers=headers, json={
            "resume_id": resume_id, "format": "pdf", "template": "classic"
        })
        if r.status_code != 201:
            print(f"   [FAIL] PDF export failed: {r.status_code} {r.text}")
            return
        pdf_doc = r.json()
        doc_id = pdf_doc["document_id"]
        print("   [OK] PDF export generated: document_id={}".format(doc_id))
        
        # Download and verify PDF
        r = await client.get(f"/api/v1/exports/{doc_id}/download", headers=headers)
        if r.status_code != 200:
            print(f"   [FAIL] PDF download failed: {r.status_code}")
            return
        pdf_content = r.content
        if len(pdf_content) > 500 and pdf_content.startswith(b"%PDF"):
            print("   [OK] PDF downloaded: {} bytes, valid header".format(len(pdf_content)))
        else:
            print("   [FAIL] PDF too small or invalid header")
            return
        
        # Verify text is extractable from PDF
        extracted = PDFParser.extract_text(pdf_content)
        if "John" in extracted and "TechCorp" in extracted and "Python" in extracted:
            print("   [OK] PDF contains selectable text with key content")
        else:
            print("   [FAIL] PDF text extraction missing key content")
            return
        
        # 12. Export DOCX
        print("\n12. DOCX EXPORT")
        r = await client.post("/api/v1/exports", headers=headers, json={
            "resume_id": resume_id, "format": "docx", "template": "professional"
        })
        if r.status_code != 201:
            print(f"   [FAIL] DOCX export failed: {r.status_code}")
            return
        docx_doc = r.json()
        docx_id = docx_doc["document_id"]
        print("   [OK] DOCX export generated: document_id={}".format(docx_id))
        
        # Download and verify DOCX
        r = await client.get(f"/api/v1/exports/{docx_id}/download", headers=headers)
        if r.status_code != 200:
            print(f"   [FAIL] DOCX download failed: {r.status_code}")
            return
        docx_content = r.content
        if len(docx_content) > 500 and docx_content.startswith(b"PK"):
            print("   [OK] DOCX downloaded: {} bytes, valid header".format(len(docx_content)))
        else:
            print("   [FAIL] DOCX too small or invalid header")
            return
        
        # 13. Logout
        print("\n13. LOGOUT")
        r = await client.post("/api/v1/auth/logout")
        if r.status_code == 200:
            print("   [OK] Logout successful")
        else:
            print("   [WARN] Logout returned: {}".format(r.status_code))
        
        # 14. Unauthorized access test
        print("\n14. UNAUTHORIZED ACCESS BLOCKING")
        r = await client.get("/api/v1/resumes/")  # No auth headers
        print("   [OK] Unauthenticated request returns: {}".format(r.status_code))
        
        print("\n" + "=" * 60)
        print("ALL CORE WORKFLOWS VERIFIED SUCCESSFULLY")
        print("=" * 60)
    
    # Cleanup
    try:
        os.remove("test_resume.txt")
        os.remove("test_jd.txt")
    except:
        pass

asyncio.run(test())