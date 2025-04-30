import requests
from database import db
from models import Palabra
from app import app  # 🚨 Cuidado con importaciones circulares
import os

# Lista de palabras en inglés con sus traducciones al español
palabras = [
    ("apple", "manzana"),
    ("dog", "perro"),
    ("car", "coche"),
    ("house", "casa"),
    ("book", "libro"),
    ("sun", "sol"),
    ("moon", "luna"),
    ("cat", "gato"),
    ("water", "agua"),
    ("tree", "árbol"),
    ("chair", "silla"),
    ("computer", "computadora"),
    ("phone", "teléfono"),
    ("bread", "pan"),
    ("table", "mesa"),
    ("window", "ventana"),
    ("flower", "flor"),
    ("bicycle", "bicicleta"),
    ("ball", "pelota"),
    ("lamp", "lámpara"),
    ("clock", "reloj"),
    ("shirt", "camisa"),
    ("shoes", "zapatos"),
    ("pencil", "lápiz"),
    ("wood", "madera"),
    ("sky", "cielo"),
    ("bird", "pájaro"),
    ("ocean", "océano"),
    ("mountain", "montaña"),
    ("river", "río"),
    ("lake", "lago"),
    ("cloud", "nube"),
    ("rain", "lluvia"),
    ("snow", "nieve"),
    ("wind", "viento"),
    ("fire", "fuego"),
    ("rainbow", "arco iris"),
    ("star", "estrella"),
    ("planet", "planeta"),
    ("chocolate", "chocolate"),
    ("jacket", "chaqueta"),
    ("glove", "guante"),
    ("hat", "sombrero"),
    ("key", "llave"),
    ("door", "puerta"),
    ("floor", "piso"),
    ("smile", "sonrisa"),
    ("coffee", "cafe"),
    ("remote control", "control remoto"),
    ("mouse","raton")

]

# API Key de Pexels (colócala en una variable de entorno para seguridad)
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "RF0PfQup9qnXqF6rQHZwlKhEv3LnP4DwPqJFQuARedzNUYuLM5I3lYmY")  # 🔹 Reemplázala por tu clave
PEXELS_URL = "https://api.pexels.com/v1/search"

def obtener_url_imagen(palabra):
    """Obtiene la URL de una imagen de Pexels para una palabra dada."""
    headers = {
        "Authorization": PEXELS_API_KEY  # API Key en el encabezado
    }
    params = {
        "query": palabra,
        "per_page": 1  # Solo queremos una imagen por palabra
    }

    try:
        response = requests.get(PEXELS_URL, headers=headers, params=params)
        response.raise_for_status()  # Lanza un error si la solicitud falla
        data = response.json()
        if data["photos"]:
            return data["photos"][0]["src"]["medium"]  # URL de la imagen
        else:
            print(f"⚠ No se encontró imagen para {palabra}, usando placeholder.")
            return "https://via.placeholder.com/200"
    except Exception as e:
        print(f"❌ Error al obtener imagen para {palabra}: {e}")
        return "https://via.placeholder.com/200"

if __name__ == "__main__":
    with app.app_context():
        for palabra_en, palabra_es in palabras:
            # Evitar duplicados
            existe = Palabra.query.filter_by(palabra_en=palabra_en, palabra_es=palabra_es).first()
            if existe:
                print(f"⏭️ Ya existe: {palabra_en} - {palabra_es}, se omite.")
                continue

            imagen_url = obtener_url_imagen(palabra_en)
            nueva_palabra = Palabra(imagen_url=imagen_url, palabra_en=palabra_en, palabra_es=palabra_es)
            db.session.add(nueva_palabra)

        db.session.commit()
        print("✅ Palabras insertadas sin duplicados.")