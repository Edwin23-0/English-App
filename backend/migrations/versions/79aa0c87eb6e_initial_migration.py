"""Initial migration

Revision ID: 79aa0c87eb6e
Revises: 
Create Date: 2025-04-01 01:54:52.856897

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '79aa0c87eb6e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('palabras',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('imagen_url', sa.String(length=255), nullable=False),
    sa.Column('palabra_en', sa.String(length=50), nullable=False),
    sa.Column('palabra_es', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('palabra_en')
    )
    op.create_table('usuarios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('nombre')
    )
    op.create_table('respuestas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('usuario_id', sa.Integer(), nullable=True),
    sa.Column('palabra_id', sa.Integer(), nullable=False),
    sa.Column('dificultad', sa.Enum('fácil', 'medio', 'difícil', name='dificultad_nivel'), nullable=False),
    sa.Column('ultima_vista', sa.DateTime(), nullable=True),
    sa.Column('siguiente_repeticion', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['palabra_id'], ['palabras.id'], ),
    sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('respuestas')
    op.drop_table('usuarios')
    op.drop_table('palabras')
    # ### end Alembic commands ###
