from app import app
from database import db
from models import Palabra

with app.app_context():
    palabras = Palabra.query.all()
    print(f"Total de palabras en la base de datos: {len(palabras)}")
    for palabra in palabras:
        print(f"{palabra.id} - {palabra.palabra_en} -> {palabra.palabra_es}")
