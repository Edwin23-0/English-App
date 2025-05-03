from database import db
from models import Palabra
from app import app  # Asegúrate de importar tu app Flask

def eliminar_palabras_duplicadas():
    palabras_vistas = set()
    palabras_a_eliminar = []

    palabras = Palabra.query.order_by(Palabra.id).all()

    for palabra in palabras:
        clave = (palabra.palabra_en.strip().lower(), palabra.palabra_es.strip().lower())

        if clave in palabras_vistas:
            print(f"🗑️ Eliminando duplicado: {palabra.palabra_en} (ID {palabra.id})")
            palabras_a_eliminar.append(palabra)
        else:
            palabras_vistas.add(clave)

    for palabra in palabras_a_eliminar:
        db.session.delete(palabra)

    db.session.commit()
    print(f"✅ {len(palabras_a_eliminar)} palabras duplicadas eliminadas.")

if __name__ == "__main__":
    with app.app_context():
        eliminar_palabras_duplicadas()
