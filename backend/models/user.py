from backend.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=False, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)  # ✅ JUST A COLUMN
    role = db.Column(db.String(20), default="sales_rep")
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
