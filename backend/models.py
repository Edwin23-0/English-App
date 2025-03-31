from database import db
from datetime import datetime
from sqlalchemy import Enum



class Palabra(db.Model):
    __tablename__ = "palabras"
    
    id = db.Column(db.Integer, primary_key=True)
    imagen_url = db.Column(db.String(255), nullable=False)
    palabra_en = db.Column(db.String(50), nullable=False, unique=True)
    palabra_es = db.Column(db.String(50), nullable=False)
    
    respuestas = db.relationship("Respuesta", backref="palabra", lazy=True)

    def __repr__(self):
        return f"<Palabra {self.palabra_en}>"

class Usuario(db.Model):
    __tablename__ = "usuarios"
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    
    respuestas = db.relationship("Respuesta", backref="usuario", lazy=True)

    def __repr__(self):
        return f"<Usuario {self.nombre}>"

class Respuesta(db.Model):
    __tablename__ = "respuestas"
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=True)
    palabra_id = db.Column(db.Integer, db.ForeignKey("palabras.id"), nullable=False)
    dificultad = db.Column(Enum("fácil", "medio", "difícil", name="dificultad_nivel"), nullable=False)
    ultima_vista = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    siguiente_repeticion = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # 🔥 Nueva columna

    def __repr__(self):
        return f"<Respuesta {self.usuario_id} - {self.palabra_id} ({self.dificultad})>"
