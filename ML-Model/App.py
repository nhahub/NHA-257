from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Initialize Appfrom flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Initialize App
app = Flask(__name__)
CORS(app) # Allow .NET to talk to Python

# --- SMART PREDICTION LOGIC ---
# This mimics your ML model's behavior so you can demo the full system
def calculate_prediction(data):
    # 1. Extract scores (default to 50 if missing)
    vis = data.get('pre_Visual', 50)
    work = data.get('pre_Working', 50)
    aud = data.get('pre_Auditory', 50)
    epi = data.get('pre_Episodic', 50)

    # 2. Identify Weakness
    scores = {"Visual": vis, "Working": work, "Auditory": aud, "Episodic": epi}
    weakest_cat = min(scores, key=scores.get)
    lowest_score = scores[weakest_cat]

    # 3. Calculate Improvement Potential
    # Lower scores have higher room for improvement
    improvement = (100 - lowest_score) * 0.25 
    
    return round(improvement, 1)

@app.route("/", methods=["GET"])
def home():
    return {"message": "Kids Memory AI Service is Running!"}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1. Get Data from .NET
        data = request.get_json()
        
        # 2. Run Logic
        prediction_value = calculate_prediction(data)

        # 3. Return Response
        return jsonify({
            "improvement_prediction": float(prediction_value)
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    print("🤖 ML Service running on http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000)
app = Flask(__name__)
CORS(app) # Allow .NET to talk to Python

def calculate_prediction(data):
    # 1. Extract scores (default to 50 if missing)
    vis = data.get('pre_Visual', 50)
    work = data.get('pre_Working', 50)
    aud = data.get('pre_Auditory', 50)
    epi = data.get('pre_Episodic', 50)

    # 2. Identify Weakness
    scores = {"Visual": vis, "Working": work, "Auditory": aud, "Episodic": epi}
    weakest_cat = min(scores, key=scores.get)
    lowest_score = scores[weakest_cat]

    # 3. Calculate Improvement Potential
    # Lower scores have higher room for improvement
    improvement = (100 - lowest_score) * 0.25 
    
    return round(improvement, 1)

@app.route("/", methods=["GET"])
def home():
    return {"message": "Kids Memory AI Service is Running!"}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1. Get Data from .NET
        data = request.get_json()
        
        # 2. Run Logic
        prediction_value = calculate_prediction(data)

        # 3. Return Response
        return jsonify({
            "improvement_prediction": float(prediction_value)
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    print("🤖 ML Service running on http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000)