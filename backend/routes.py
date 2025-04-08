from flask import Blueprint, jsonify, request
from database import db
from models import Palabra, Usuario, Respuesta
import re
from datetime import datetime, timedelta
from sqlalchemy.orm import joinedload

api_bp = Blueprint("api", __name__)

@api_bp.route("/", methods=["GET"])
def home():
    return jsonify({"mensaje": "Bienvenido a la API de English App"}), 200

# Mostrar una sola palabra pendiente
@api_bp.route("/palabra", methods=["GET"])
def obtener_palabra():
    usuario_id = request.args.get("usuario_id", type=int)

    if not usuario_id:
        return jsonify({"error": "Se requiere un usuario_id"}), 400

    respuesta = (
        db.session.query(Respuesta)
        .join(Palabra)
        .filter(Respuesta.usuario_id == usuario_id, Respuesta.siguiente_repeticion <= datetime.utcnow())
        .order_by(Respuesta.siguiente_repeticion.asc())
        .first()
    )

    if not respuesta:
        return jsonify({"mensaje": "No hay palabras para repasar en este momento"}), 404

    palabra = respuesta.palabra

    return jsonify({
        "respuesta_id": respuesta.id,
        "palabra_id": palabra.id,
        "palabra_en": palabra.palabra_en,
        "palabra_es": palabra.palabra_es,
        "imagen_url": palabra.imagen_url
    })

# Diccionario de intervalos de repetición
DIFERENCIAS_TIEMPO = {
    "fácil": timedelta(days=5),
    "medio": timedelta(minutes=10),
    "difícil": timedelta(seconds=30)
}

# Obtener todas las palabras pendientes
@api_bp.route("/palabras/pendientes/<int:usuario_id>")
def obtener_palabras_pendientes(usuario_id):
    # Verificar si el usuario ya tiene respuestas registradas
    respuestas_existentes = Respuesta.query.filter_by(usuario_id=usuario_id).all()

    if not respuestas_existentes:
        print(f"📥 Usuario {usuario_id} no tiene respuestas, inicializando...")

        # Traer todas las palabras del sistema
        palabras = Palabra.query.all()

        for palabra in palabras:
            nueva_respuesta = Respuesta(
                palabra_id=palabra.id,
                usuario_id=usuario_id,
                dificultad='medio',  # Dificultad inicial por defecto
                siguiente_repeticion=datetime.utcnow()  # Ya está disponible
            )
            db.session.add(nueva_respuesta)

        db.session.commit()
        print(f"✅ {len(palabras)} respuestas creadas para el usuario {usuario_id}")

    # Obtener palabras pendientes (fecha ya vencida o actual)
    ahora = datetime.utcnow()
    pendientes = (
        db.session.query(Respuesta, Palabra)
        .join(Palabra, Respuesta.palabra_id == Palabra.id)
        .filter(
            Respuesta.usuario_id == usuario_id,
            Respuesta.siguiente_repeticion <= ahora
        )
        .order_by(Respuesta.siguiente_repeticion.asc())
        .all()
    )

    resultado = []
    for respuesta, palabra in pendientes:
        resultado.append({
            "respuesta_id": respuesta.id,
            "palabra_id": palabra.id,
            "imagen_url": palabra.imagen_url,
            "palabra_en": palabra.palabra_en,
            "palabra_es": palabra.palabra_es,
            "dificultad": respuesta.dificultad,
            "siguiente_repeticion": respuesta.siguiente_repeticion.isoformat()
        })

    return jsonify(resultado)

# Actualizar el tiempo de repetición según dificultad
@api_bp.route("/actualizar_repeticion", methods=["POST", "OPTIONS"])
def actualizar_repeticion():
    if request.method == "OPTIONS":
        return '', 200

    data = request.json
    palabra_id = data.get("palabra_id")
    usuario_id = data.get("usuario_id")
    dificultad = data.get("dificultad")

    if not all([palabra_id, usuario_id, dificultad]):
        return jsonify({"error": "Faltan parámetros"}), 400

    respuesta = Respuesta.query.filter_by(usuario_id=usuario_id, palabra_id=palabra_id).first()

    if not respuesta:
        return jsonify({"error": "No se encontró el registro de la palabra"}), 404

    if dificultad in DIFERENCIAS_TIEMPO:
        respuesta.siguiente_repeticion = datetime.utcnow() + DIFERENCIAS_TIEMPO[dificultad]
    else:
        return jsonify({"error": "Nivel de dificultad inválido"}), 400

    db.session.commit()
    return jsonify({"mensaje": "Repetición actualizada"}), 200

# Validación de contraseña
def validar_password(password):
    if len(password) < 8:
        return "La contraseña debe tener al menos 8 caracteres"
    if not re.search(r"[A-Z]", password):
        return "La contraseña debe contener al menos una letra mayúscula"
    if not re.search(r"[a-z]", password):
        return "La contraseña debe contener al menos una letra minúscula"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "La contraseña debe contener al menos un símbolo"
    return None

# Validación de formato de email
def validar_email(email):
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return "Formato de email inválido"
    return None

# Registro de usuario
@api_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    nombre = data.get("nombre")
    password = data.get("password")
    email = data.get("email")

    if not nombre or not email or not password:
        return jsonify({"error": "Nombre, email y contraseña son requeridos"}), 400

    if Usuario.query.filter_by(nombre=nombre).first():
        return jsonify({"error": "El usuario ya existe"}), 400

    error_email = validar_email(email)
    if error_email:
        return jsonify({"error": error_email}), 400

    error_password = validar_password(password)
    if error_password:
        return jsonify({"error": error_password}), 400

    nuevo_usuario = Usuario(nombre=nombre, email=email)
    nuevo_usuario.set_password(password)
    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({"mensaje": "Usuario registrado exitosamente"}), 201

# Login de usuario
@api_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario is None or not usuario.check_password(password):
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

    print(f"Usuario {usuario.nombre} inició sesión correctamente.")
    return jsonify({"mensaje": "Inicio de sesión exitoso", "usuario": usuario.nombre}), 200

# Eliminar todos los usuarios
@api_bp.route("/delete_all_users", methods=["DELETE"])
def delete_all_users():
    try:
        num_rows_deleted = db.session.query(Usuario).delete()
        db.session.commit()
        return jsonify({"mensaje": f"Se eliminaron {num_rows_deleted} usuarios"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
