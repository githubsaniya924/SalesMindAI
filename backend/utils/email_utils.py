import smtplib
from email.message import EmailMessage
from backend.config import Config

def send_otp_email(to_email, otp):
    print("EMAIL USER:", Config.EMAIL_USER)
    print("EMAIL PASS:", Config.EMAIL_PASSWORD)

    msg = EmailMessage()
    msg["Subject"] = "Your OTP Verification Code"
    msg["From"] = Config.EMAIL_USER
    msg["To"] = to_email
    msg.set_content(f"Your OTP is: {otp}")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(Config.EMAIL_USER, Config.EMAIL_PASSWORD)
        server.send_message(msg)
