from flask import Blueprint, jsonify, request
from database import db
from models import Palabra, Usuario
import random
import re  # Importamos para validación de contraseña

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

# Función para validar contraseñas

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

# Ruta de registro
@api_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    nombre = data.get("nombre")
    password = data.get("password")
    email = data.get("email") 

    if not nombre or not email or not password:
        return jsonify({"error": "Nombre, email y contraseña son requeridos"}), 400
    
    # Verificar si el usuario ya existe
    if Usuario.query.filter_by(nombre=nombre).first():
        return jsonify({"error": "El usuario ya existe"}), 400

    # Validar contraseña
    error_password = validar_password(password)
    if error_password:
        return jsonify({"error": error_password}), 400

    # Crear nuevo usuario
    nuevo_usuario = Usuario(nombre=nombre, email=email)
    nuevo_usuario.set_password(password)
    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({"mensaje": "Usuario registrado exitosamente"}), 201

# Ruta de login
@api_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    print("Datos recibidos:", data)
    print(f"Intentando iniciar sesión con email: {email}")

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario is None:
        print("Usuario no encontrado")
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

    print(f"Contraseña ingresada: {password}")
    print(f"Contraseña almacenada (hash): {usuario.password_hash}")

    if not usuario.check_password(password):
        print("Contraseña incorrecta")
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

    print("Inicio de sesión exitoso")
    return jsonify({"mensaje": "Inicio de sesión exitoso", "usuario": usuario.nombre}), 200
    

@api_bp.route("/delete_all_users", methods=["DELETE"])
def delete_all_users():
    try:
        num_rows_deleted = db.session.query(Usuario).delete()
        db.session.commit()
        return jsonify({"mensaje": f"Se eliminaron {num_rows_deleted} usuarios"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
