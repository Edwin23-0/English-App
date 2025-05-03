from models import db, Respuesta
from datetime import datetime, timedelta

def calcular_proxima_aparicion(dificultad):
    if dificultad == "fácil":
        return datetime.utcnow() + timedelta(days=7)
    elif dificultad == "medio":
        return datetime.utcnow() + timedelta(days=3)
    else:
        return datetime.utcnow() + timedelta(hours=1)

def guardar_respuesta(usuario_id, palabra_id, dificultad):
    proxima_vista = calcular_proxima_aparicion(dificultad)
    nueva_respuesta = Respuesta(
        usuario_id=usuario_id,
        palabra_id=palabra_id,
        dificultad=dificultad,
        ultima_vista=proxima_vista
    )
    db.session.add(nueva_respuesta)
    db.session.commit()
