from database import db
from models import Respuesta
from datetime import datetime, timedelta



def actualizar_repeticion(usuario_id, palabra_id, dificultad):
    """Actualiza la siguiente repetición de una palabra según la dificultad"""
    ahora = datetime.now()

    if dificultad == "fácil":
        intervalo = timedelta(days=1)
    elif dificultad == "medio":
        intervalo = timedelta(hours=8)
    elif dificultad == "difícil":
        intervalo = timedelta(minutes=1)
    else:
        intervalo = timedelta(minutes=5)

    siguiente_repeticion = ahora + intervalo

    # Buscar la respuesta en la base de datos y actualizarla
    respuesta = Respuesta.query.filter_by(usuario_id=usuario_id, palabra_id=palabra_id).first()
    if respuesta:
        respuesta.ultima_vista = ahora
        respuesta.siguiente_repeticion = siguiente_repeticion
        db.session.commit()
        return {"mensaje": f"Palabra {palabra_id} actualizada. Próxima repetición: {siguiente_repeticion}"}
    else:
        return {"error": "No se encontró la respuesta en la base de datos"}
