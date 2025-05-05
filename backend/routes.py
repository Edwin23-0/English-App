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

@api_bp.route("/palabra", methods=["GET"])
def obtener_palabra():
    usuario_id = request.args.get("usuario_id", type=int)

    if not usuario_id:
        return jsonify({"error": "Se requiere un usuario_id"}), 400

    # Paso 1: Buscar palabras con repetición vencida
    respuesta = (
        db.session.query(Respuesta)
        .join(Palabra)
        .filter(
            Respuesta.usuario_id == usuario_id,
            Respuesta.siguiente_repeticion <= datetime.utcnow()
        )
        .order_by(Respuesta.siguiente_repeticion.asc())
        .first()
    )

    if respuesta:
        palabra = respuesta.palabra
        return jsonify({
            "respuesta_id": respuesta.id,
            "palabra_id": palabra.id,
            "imagen_url": palabra.imagen_url,
            "palabra_en": palabra.palabra_en,
            "palabra_es": palabra.palabra_es
        })

    # Paso 2: Buscar una palabra nueva (que el usuario no haya visto)
    subquery = db.session.query(Respuesta.palabra_id).filter_by(usuario_id=usuario_id)
    palabra_nueva = (
        db.session.query(Palabra)
        .filter(~Palabra.id.in_(subquery))
        .first()
    )

    if palabra_nueva:
        return jsonify({
            "respuesta_id": None,
            "palabra_id": palabra_nueva.id,
            "imagen_url": palabra_nueva.imagen_url,
            "palabra_en": palabra_nueva.palabra_en,
            "palabra_es": palabra_nueva.palabra_es
        })

    return jsonify({"mensaje": "No hay palabras disponibles en este momento"}), 404

# Diccionario de intervalos de repetición
DIFERENCIAS_TIEMPO = {
    "fácil": timedelta(days=2),
    "medio": timedelta(minutes=10),
    "difícil": timedelta(seconds=30)
}


# Verificar si el usuario ha visto todas las palabras
@api_bp.route("/palabras/completadas/<int:usuario_id>", methods=["GET"])
def verificar_completadas(usuario_id):
    total_respuestas = Respuesta.query.filter_by(usuario_id=usuario_id).count()
    total_palabras = Palabra.query.count()

    if total_respuestas >= total_palabras:
        return jsonify({"completado": True})
    else:
        return jsonify({"completado": False})

# Obtener todas las palabras
@api_bp.route("/palabras/todas/<int:usuario_id>", methods=["GET"])
def obtener_todas(usuario_id):
    palabras = Palabra.query.all()

    resultado = []
    for palabra in palabras:
        # Buscar si ya existe respuesta para esa palabra
        respuesta = Respuesta.query.filter_by(palabra_id=palabra.id, usuario_id=usuario_id).first()
        resultado.append({
            "palabra_id": palabra.id,
            "imagen_url": palabra.imagen_url,
            "palabra_en": palabra.palabra_en,
            "palabra_es": palabra.palabra_es,
            "respuesta_id": respuesta.id if respuesta else None
        })
    
    return jsonify(resultado)


    


@api_bp.route("/palabras/pendientes/<int:usuario_id>", methods=["GET"])
def obtener_palabras_pendientes(usuario_id):
    limite = request.args.get("limite", default=50, type=int)
    ver = request.args.get("ver", default=10, type=int)

    ahora = datetime.utcnow()

    # Paso 1: Verifica si ya tiene respuestas, si no, crea algunas por defecto
    respuestas_existentes = Respuesta.query.filter_by(usuario_id=usuario_id).all()

    if not respuestas_existentes:
        palabras = Palabra.query.order_by(Palabra.id.asc()).limit(limite).all()
        for palabra in palabras:
            nueva_respuesta = Respuesta(
                palabra_id=palabra.id,
                usuario_id=usuario_id,
                dificultad='medio',  # O 'fácil', dependiendo de cómo prefieras iniciar
                siguiente_repeticion=datetime.utcnow() + DIFERENCIAS_TIEMPO["medio"]  # Ajuste para que inicie la repetición
        )
        db.session.add(nueva_respuesta)
    db.session.commit()


    # Paso 2: Obtener palabras vencidas
    query_vencidas = (
        db.session.query(Respuesta, Palabra)
        .join(Palabra, Respuesta.palabra_id == Palabra.id)
        .filter(Respuesta.usuario_id == usuario_id, Respuesta.siguiente_repeticion <= ahora)
        .order_by(
            db.case(
                {'fácil': 1, 'medio': 2, 'difícil': 3}, else_=4
            ).asc(),
            Respuesta.siguiente_repeticion.asc(),
            Palabra.id.asc()
            
        )
        .limit(ver)
    )

    vencidas = query_vencidas.all()
    cantidad_vencidas = len(vencidas)

    # Paso 3: Si faltan, obtener nuevas palabras que no tengan respuesta
    if cantidad_vencidas < ver:
        palabras_mostradas_ids = [p.id for r, p in vencidas]

        subquery = db.session.query(Respuesta.palabra_id).filter_by(usuario_id=usuario_id)
        nuevas_palabras = (
            Palabra.query
            .filter(~Palabra.id.in_(subquery))
            .filter(~Palabra.id.in_(palabras_mostradas_ids))  # Por si acaso
            .limit(ver - cantidad_vencidas)
            .all()
        )

        # Crear respuesta temporal para las nuevas palabras
        for palabra in nuevas_palabras:
            nueva_respuesta = Respuesta(
                palabra_id=palabra.id,
                usuario_id=usuario_id,
                dificultad='medio',
                siguiente_repeticion=ahora
            )
            db.session.add(nueva_respuesta)
        db.session.commit()

        # Obtenerlas con join para agregarlas al resultado
        nuevas_asociadas = (
            db.session.query(Respuesta, Palabra)
            .join(Palabra, Respuesta.palabra_id == Palabra.id)
            .filter(Respuesta.usuario_id == usuario_id, Respuesta.palabra_id.in_([p.id for p in nuevas_palabras]))
            .all()
        )

        vencidas.extend(nuevas_asociadas)
      
       


    # Armar el JSON de salida
    resultado = [{
        "respuesta_id": r.id,
        "palabra_id": p.id,
        "imagen_url": p.imagen_url,
        "palabra_en": p.palabra_en,
        "palabra_es": p.palabra_es
    } for r, p in vencidas]

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

    # Actualizamos tanto la dificultad como la próxima repetición
    if dificultad in DIFERENCIAS_TIEMPO:
        respuesta.dificultad = dificultad  # Se registra la dificultad seleccionada
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
