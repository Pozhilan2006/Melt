"""add is_onboarded and is_active to users

Revision ID: 001_add_user_auth_fields
Revises: 
Create Date: 2026-09-20 09:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_add_user_auth_fields'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add is_active and is_onboarded boolean columns to the users table."""
    op.add_column(
        'users',
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true())
    )
    op.add_column(
        'users',
        sa.Column('is_onboarded', sa.Boolean(), nullable=False, server_default=sa.false())
    )


def downgrade() -> None:
    """Remove is_active and is_onboarded from users table."""
    op.drop_column('users', 'is_onboarded')
    op.drop_column('users', 'is_active')
