import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify
from flask_migrate import Migrate

# VVV UPDATED IMPORTS based on your latest extensions.py VVV
from backend.extensions import db, migrate, cors, celery 
# --------------------------------------------------------

from backend.config import Config
# Import blueprint
from backend.routes.leads import leads_bp
# Import tasks (must be imported after celery is defined)
import backend.utils.tasks 

def create_app():
    app = Flask(__name__)
    
    app.config.from_object(Config)

    print("DB URL =", app.config.get("SQLALCHEMY_DATABASE_URI"))

    # 1. Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # VVV CRITICAL FIX: Initialize CORS VVV
    # Allows requests from the React frontend (localhost:3000) to the backend (localhost:5000)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}) 

    # ---- CELERY CONFIG ----
    celery.conf.update(app.config)
    celery.conf.broker_url = app.config["CELERY_BROKER_URL"]
    celery.conf.result_backend = app.config["CELERY_RESULT_BACKEND"]

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
    celery.Task = ContextTask

    # Import models for migrations
    from backend.models.user import User
    from backend.models.lead import Lead
    from backend.models.outreach import OutreachLog
    from backend.models.enrichment import LeadEnrichment
    from backend.models.schedule import UserSchedule

    # Register blueprint
    app.register_blueprint(leads_bp, url_prefix="/api/leads")

    # Sample route to get Celery task status
    @app.route('/api/tasks/<task_id>', methods=['GET'])
    def get_task_status(task_id):
        task = celery.AsyncResult(task_id)

        if task.state == 'PENDING':
            response = {'status': task.state}
        elif task.state != 'FAILURE':
            response = {
                'status': task.state,
                'message': 'Task completed successfully.',
                'result': task.info
            }
        else:
            response = {
                'status': task.state,
                'message': 'Task failed.',
                'error': str(task.info)
            }

        return jsonify(response)

    return app 

# -----------------------------
# Top-level app object for Flask
# -----------------------------
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)