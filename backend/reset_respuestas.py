from app import app
from database import db
from models import Respuesta

with app.app_context():
    usuario_id = 1

    # 🧹 Borrar todas las respuestas del usuario
    respuestas_borradas = Respuesta.query.filter_by(usuario_id=usuario_id).delete()
    db.session.commit()

    print(f"Se borraron {respuestas_borradas} respuestas del usuario {usuario_id}")
