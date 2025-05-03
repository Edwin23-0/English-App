from database import db
from models import Palabra
from app import app

def eliminar_palabra(palabra_en, palabra_es):
    palabra = Palabra.query.filter(
        db.func.lower(Palabra.palabra_en) == palabra_en.strip().lower(),
        db.func.lower(Palabra.palabra_es) == palabra_es.strip().lower()
    ).first()

    if palabra:
        print(f"🗑️ Eliminando: {palabra.palabra_en} - {palabra.palabra_es}")
        db.session.delete(palabra)
        db.session.commit()
        print("✅ Palabra eliminada correctamente.")
    else:
        print("⚠️ Palabra no encontrada.")

if __name__ == "__main__":
    with app.app_context():
        # 👇 Cambia estos valores según lo que quieras borrar
        eliminar_palabra("TV", "televisor")
