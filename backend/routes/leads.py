from flask import Blueprint, request, jsonify, abort
import json
import pandas as pd # Needed for CSV upload handling

# --- Imports for CSV Upload ---
from backend.extensions import db 
from backend.utils.cleaning import clean_and_insert_leads
# ------------------------------

# --- Imports for Celery Task ---
from backend.utils.tasks import fetch_leads_task 
# -------------------------------

# Create the blueprint
leads_bp = Blueprint("leads", __name__)

# --- 1. ROUTE FOR MANUAL CSV UPLOAD (MISSING ROUTE) ---
@leads_bp.route("/upload", methods=["POST"])
def upload_csv():
    """Handles the manual upload of a CSV file for lead insertion."""
    
    # 1. Check if file exists in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    f = request.files['file']
    
    # 2. Check if the file is empty
    if f.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # 3. Read the CSV file into a Pandas DataFrame
        df = pd.read_csv(f)
    except Exception as e:
        # Added basic file read error handling
        return jsonify({"error": f"Error reading CSV file: {str(e)}"}), 400

    # 4. Process and insert the leads
    result = clean_and_insert_leads(df, source="csv")
    
    # 5. Return the result and the appropriate status code
    if result["inserted"] > 0:
        return jsonify(result), 201
    else:
        # If no records were inserted (e.g., all were skipped), return 200/202
        return jsonify(result), 202 


# --- 2. ROUTE FOR ASYNCHRONOUS LEAD GENERATION (EXISTING ROUTE) ---
@leads_bp.route("/generate_on_demand", methods=["POST"])
def generate_on_demand():
    """
    Trigger a Celery task to fetch leads using Hunter.io.
    Only expects: { "industry": "software" }
    """

    body = request.get_json(silent=True)

    if not isinstance(body, dict):
        abort(400, description="Invalid JSON format. Must be an object.")

    industry = body.get("industry")

    if not industry:
        abort(400, description="Missing required field: industry")

    try:
        task = fetch_leads_task.delay(industry)
    except Exception as e:
        abort(500, description=f"Failed to start task: {str(e)}")

    return jsonify({
        "message": "Lead generation task started.",
        "industry": industry,
        "task_id": task.id
    }), 202