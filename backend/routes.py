from flask import Blueprint, jsonify, request
from database import db
from models import Palabra, Respuesta  # ✅ Corrección en la importación
import random
from utils import actualizar_repeticion

api_bp = Blueprint("api", __name__)

@api_bp.route("/", methods=["GET"])
def home():
    return jsonify({"mensaje": "Bienvenido a la API de English App"}), 200

@api_bp.route("/palabra", methods=["GET"])
def obtener_palabra():
    palabras = Palabra.query.all()
    if not palabras:
        return jsonify({"error": "No hay palabras en la base de datos"}), 404
    
    palabra_random = random.choice(palabras)
    return jsonify({
        "id": palabra_random.id,
        "palabra_en": palabra_random.palabra_en,
        "palabra_es": palabra_random.palabra_es,
        "imagen_url": palabra_random.imagen_url
    })


@api_bp.route("/respuesta", methods=["POST"])
def registrar_respuesta():
    data = request.json
    palabra_id = data.get("palabra_id")
    usuario_id = data.get("usuario_id")  # ✅ Se agregó usuario_id
    dificultad = data.get("dificultad")

    if not usuario_id:
        return jsonify({"error": "Se requiere usuario_id"}), 400

    if dificultad not in ["fácil", "medio", "difícil"]:
        return jsonify({"error": "Dificultad inválida"}), 400

    nueva_respuesta = Respuesta(usuario_id=usuario_id, palabra_id=palabra_id, dificultad=dificultad)
    db.session.add(nueva_respuesta)
    db.session.commit()

    return jsonify({"mensaje": "Respuesta registrada con éxito"}), 201


@api_bp.route("/actualizar_repeticion", methods=["POST"])
def actualizar():
    datos = request.get_json()

    usuario_id = datos.get("usuario_id")
    palabra_id = datos.get("palabra_id")
    dificultad = datos.get("dificultad")

    if not usuario_id or not palabra_id or not dificultad:
        return jsonify({"error": "Faltan datos"}), 400

    resultado = actualizar_repeticion(usuario_id, palabra_id, dificultad)
    return jsonify(resultado)