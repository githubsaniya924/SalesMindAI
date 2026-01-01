from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
import re

from backend.extensions import db
from backend.models.user import User
from backend.models.otp import OTP
from backend.utils.otp_utils import generate_otp
from backend.utils.email_utils import send_otp_email

auth_bp = Blueprint("auth", __name__)  # SINGLE blueprint

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not re.match(r"^[A-Za-z\s]+$", name):
        return jsonify({"error": "Name must contain only alphabets"}), 400

    if not re.match(r"^[^\s@]+@[^\s@]+\.com$", email):
        return jsonify({"error": "Email must end with .com"}), 400

    if not re.match(r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{10,}$", password):
        return jsonify({"error": "Weak password"}), 400

    # if User.query.filter_by(email=email).first():
    #     return jsonify({"error": "Email already exists"}), 400
 
    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        is_verified=False
    )
    
    db.session.add(user)
    db.session.commit()

    otp = generate_otp()
    otp_entry = OTP(
        user_id=user.id,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.session.add(otp_entry)
    db.session.commit()

    send_otp_email(user.email, otp)

    return jsonify({
        "message": "OTP sent to email",
        "user_id": user.id
    }), 201

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()

    user_id = data.get("user_id")
    otp = data.get("otp")

    if not user_id or not otp:
        return jsonify({"error": "User ID and OTP required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    otp_record = OTP.query.filter_by(user_id=user.id, otp=otp).first()
    if not otp_record:
        return jsonify({"error": "Invalid OTP"}), 400

    if otp_record.expires_at < datetime.utcnow():
        return jsonify({"error": "OTP expired"}), 400

    user.is_verified = True

    db.session.delete(otp_record)
    db.session.commit()

    return jsonify({"message": "Email verified successfully"}), 200



@auth_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    data = request.json

    OTP.query.filter_by(user_id=data["user_id"]).delete()

    otp = generate_otp()
    otp_entry = OTP(
        user_id=data["user_id"],
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.session.add(otp_entry)
    db.session.commit()

    user = User.query.get(data["user_id"])
    send_otp_email(user.email, otp)

    return jsonify({"message": "OTP resent"})



from werkzeug.security import check_password_hash

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Account not created"}), 404

    if not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Incorrect password"}), 401

    if not user.is_verified:
        return jsonify({"error": "Please verify your email first"}), 403

    return jsonify({
        "message": "Login successful",
        "user_id": user.id,
        "role": user.role
    }), 200
