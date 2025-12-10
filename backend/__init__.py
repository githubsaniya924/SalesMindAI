# backend/__init__.py

from flask import Flask
# Import extensions from the new file
from backend.extensions import db, migrate 
from backend.config import Config
from .extensions import db, migrate, cors

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize DB + migrations with the app instance
    db.init_app(app)
    migrate.init_app(app, db)
   # VVV --- DEFINITIVE CORS FIX --- VVV
    cors.init_app(app, resources={r"/api/*": {
        "origins": [
            "http://localhost:3000",       # Localhost is the standard React address
            "http://127.0.0.1:3000",       # 127.0.0.1 is the local IP address
            "*"                            # Fallback wildcard
        ],
        "supports_credentials": True, # Recommended for complex requests
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"] # Ensure all methods are allowed
    }})
    # ^^^ --------------------------- ^^^


    # Import models so migrations detect them
    # Note: We import models/routes *after* db/app initialization
    from backend.models.user import User
    from backend.models.lead import Lead
    from backend.models.outreach import OutreachLog
    from backend.models.enrichment import LeadEnrichment

    # Register blueprints
    from backend.routes.leads import leads_bp
    # Note: I changed the url_prefix here to match your app.py for /api/leads
    app.register_blueprint(leads_bp, url_prefix="/api/leads")

    return app