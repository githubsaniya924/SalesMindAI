from backend.extensions import db 

class OutreachLog(db.Model):
    __tablename__ = "outreach_logs"

    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey("leads.id"))
    platform = db.Column(db.String)
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    status = db.Column(db.String)
