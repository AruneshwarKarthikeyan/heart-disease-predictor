from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
import joblib

app = Flask(__name__)
CORS(app)  

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

scaler = joblib.load(r"D:\college_projects\Aruneshwar\scaler.pkl")
pca = joblib.load(r"D:\college_projects\Aruneshwar\pca.pkl")
model = joblib.load(r"D:\college_projects\Aruneshwar\mlp_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array(data['features']).reshape(1, -1)
    scaled = scaler.transform(features)
    pca_features = pca.transform(scaled)
    prediction = model.predict(pca_features)

    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)