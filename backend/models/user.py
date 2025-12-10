from backend.extensions import db 

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String)
    role = db.Column(db.String)
