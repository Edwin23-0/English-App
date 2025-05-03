from flask import Flask
from flask_cors import CORS
from database import db
from routes import api_bp

app = Flask(__name__)
CORS(app)

# ✅ Clave secreta para firmar JWT
app.config["SECRET_KEY"] = "mi_clave_secreta_segura"  # Cámbiala por una más segura en producción

# Configuración de la base de datos
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///english.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicializar la base de datos con Flask
db.init_app(app)

# Registrar los blueprints (rutas)
app.register_blueprint(api_bp)

if __name__ == "__main__":
    with app.app_context():
        # Asegura que las tablas existan en la base de datos
        app.run(debug=True)

