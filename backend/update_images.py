import requests
from app import app
from database import db
from models import Palabra

# Tu API Key de Pexels
PEXELS_API_KEY = "RF0PfQup9qnXqF6rQHZwlKhEv3LnP4DwPqJFQuARedzNUYuLM5I3lYmY"

# Función para validar si una imagen es válida
def validar_imagen(url):
    try:
        respuesta = requests.get(url, timeout=5)
        if respuesta.status_code == 200 and "image" in respuesta.headers["Content-Type"]:
            return True
    except requests.exceptions.RequestException:
        pass
    return False

# Función para obtener una nueva imagen de Pexels
def obtener_nueva_imagen(palabra):
    headers = {"Authorization": PEXELS_API_KEY}
    url = f"https://api.pexels.com/v1/search?query={palabra}&per_page=1"
    respuesta = requests.get(url, headers=headers)
    
    if respuesta.status_code == 200:
        data = respuesta.json()
        if data["photos"]:
            return data["photos"][0]["src"]["medium"]  # Obtener la URL de la imagen
    return None  # Si no encuentra imagen

# Reemplazar imágenes inválidas en la base de datos
with app.app_context():
    palabras = Palabra.query.all()
    for palabra in palabras:
        if not validar_imagen(palabra.imagen_url):  # Si la imagen no funciona
            print(f"🔄 Buscando nueva imagen para: {palabra.palabra_en}")
            nueva_imagen = obtener_nueva_imagen(palabra.palabra_en)
            
            if nueva_imagen:
                palabra.imagen_url = nueva_imagen
                print(f"✅ Imagen actualizada: {nueva_imagen}")
            else:
                print(f"⚠️ No se encontró imagen para {palabra.palabra_en}")
    
    db.session.commit()  # Guardar los cambios

print("✅ Actualización de imágenes completada.")
