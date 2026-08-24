"""Initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-24 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False, server_default=''),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('is_superuser', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Resumes table
    op.create_table(
        'resumes',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False, server_default='Untitled Resume'),
        sa.Column('original_filename', sa.String(length=255), nullable=True),
        sa.Column('file_url', sa.String(length=512), nullable=True),
        sa.Column('file_type', sa.String(length=50), nullable=True),
        sa.Column('raw_text', sa.Text(), nullable=True),
        sa.Column('parsed_content', sa.JSON(), nullable=False),
        sa.Column('is_archived', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_resumes_id'), 'resumes', ['id'], unique=False)
    op.create_index(op.f('ix_resumes_user_id'), 'resumes', ['user_id'], unique=False)

    # Resume Versions table
    op.create_table(
        'resume_versions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('version_number', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.JSON(), nullable=False),
        sa.Column('change_summary', sa.Text(), nullable=True),
        sa.Column('is_current', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_resume_versions_id'), 'resume_versions', ['id'], unique=False)
    op.create_index(op.f('ix_resume_versions_resume_id'), 'resume_versions', ['resume_id'], unique=False)

    # Job Descriptions table
    op.create_table(
        'job_descriptions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('company', sa.String(length=255), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('raw_text', sa.Text(), nullable=False),
        sa.Column('structured_content', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_job_descriptions_id'), 'job_descriptions', ['id'], unique=False)
    op.create_index(op.f('ix_job_descriptions_user_id'), 'job_descriptions', ['user_id'], unique=False)

    # Resume Analyses table
    op.create_table(
        'resume_analyses',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('resume_version_id', sa.String(length=36), nullable=True),
        sa.Column('jd_id', sa.String(length=36), nullable=False),
        sa.Column('overall_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('breakdown', sa.JSON(), nullable=False),
        sa.Column('matched_keywords', sa.JSON(), nullable=False),
        sa.Column('missing_keywords', sa.JSON(), nullable=False),
        sa.Column('weak_keywords', sa.JSON(), nullable=False),
        sa.Column('keyword_details', sa.JSON(), nullable=False),
        sa.Column('recommendations', sa.JSON(), nullable=False),
        sa.Column('summary_critique', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['jd_id'], ['job_descriptions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['resume_version_id'], ['resume_versions.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_resume_analyses_id'), 'resume_analyses', ['id'], unique=False)
    op.create_index(op.f('ix_resume_analyses_jd_id'), 'resume_analyses', ['jd_id'], unique=False)
    op.create_index(op.f('ix_resume_analyses_resume_id'), 'resume_analyses', ['resume_id'], unique=False)
    op.create_index(op.f('ix_resume_analyses_user_id'), 'resume_analyses', ['user_id'], unique=False)

    # AI Suggestions table
    op.create_table(
        'ai_suggestions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('resume_version_id', sa.String(length=36), nullable=True),
        sa.Column('analysis_id', sa.String(length=36), nullable=True),
        sa.Column('section', sa.String(length=100), nullable=False),
        sa.Column('item_id', sa.String(length=100), nullable=True),
        sa.Column('field', sa.String(length=100), nullable=True),
        sa.Column('original_text', sa.Text(), nullable=False),
        sa.Column('suggested_text', sa.Text(), nullable=False),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['analysis_id'], ['resume_analyses.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['resume_version_id'], ['resume_versions.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_ai_suggestions_id'), 'ai_suggestions', ['id'], unique=False)
    op.create_index(op.f('ix_ai_suggestions_resume_id'), 'ai_suggestions', ['resume_id'], unique=False)
    op.create_index(op.f('ix_ai_suggestions_user_id'), 'ai_suggestions', ['user_id'], unique=False)

    # Generated Documents table
    op.create_table(
        'generated_documents',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('resume_id', sa.String(length=36), nullable=False),
        sa.Column('resume_version_id', sa.String(length=36), nullable=True),
        sa.Column('format', sa.String(length=20), nullable=False),
        sa.Column('template_name', sa.String(length=100), nullable=False, server_default='classic'),
        sa.Column('file_url', sa.String(length=512), nullable=False),
        sa.Column('file_size_bytes', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['resume_version_id'], ['resume_versions.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_generated_documents_id'), 'generated_documents', ['id'], unique=False)
    op.create_index(op.f('ix_generated_documents_resume_id'), 'generated_documents', ['resume_id'], unique=False)
    op.create_index(op.f('ix_generated_documents_user_id'), 'generated_documents', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_table('generated_documents')
    op.drop_table('ai_suggestions')
    op.drop_table('resume_analyses')
    op.drop_table('job_descriptions')
    op.drop_table('resume_versions')
    op.drop_table('resumes')
    op.drop_table('users')
