import os
from dotenv import load_dotenv

# 👇 FORCE absolute path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

print("Loading ENV from:", ENV_PATH)

load_dotenv(dotenv_path=ENV_PATH)

class Config:
    # --- FLASK-SQLALCHEMY CONFIG (Keep these) ---
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # --- FLASK CORE CONFIG ---
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-key")
    
    # --- NEW API CONFIG (SerpApi & People Data Labs) ---
    # NOTE: APOLLO keys have been removed. 
    # These environment variables are now used by backend/utils/free_lead_api.py
    SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY") 
    PDL_API_KEY = os.getenv("PDL_API_KEY")
    
     # --- CELERY CONFIG (Using standard CELERY_ prefixes for reliability) ---
    # Change the default IP to localhost for better stability on Windows development environments
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://172.22.115.88:6379/0")
    
    # Change the default IP to localhost for better stability on Windows development environments
    CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://172.22.115.88:6379/0")

    # This is also good practice for Celery 5.x
    worker_pool = 'solo'
   
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

    # Celery Beat Schedule
    CELERY_BEAT_SCHEDULE = {
        'check-daily-schedule-every-minute': {
            'task': 'tasks.check_daily_schedule',
            'schedule': 60.0, 
            'args': (), 
        },
    }