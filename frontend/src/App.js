import React, { useState } from "react";
import "./App.css";

const featureInfo = [
  { name: "Age", type: "number", min: 1, max: 120 },
  { name: "Sex", label: "Sex", type: "binary" },
  { name: "Chest Pain Type", type: "number", min: 0, max: 3 },
  { name: "Resting Blood Pressure", type: "number", min: 90, max: 200 },
  { name: "Cholesterol", type: "number", min: 120, max: 564 },
  { name: "Fasting Blood Sugar", type: "binary" },
  { name: "Resting ECG Results", type: "number", min: 0, max: 2 },
  { name: "Maximum Heart Rate Achieved", type: "number", min: 70, max: 209 },
  { name: "Exercise Induced Angina", type: "binary" },
  { name: "ST Depression (Oldpeak)", type: "number", min: 0.0, max: 6.2, step: 0.1 },
  { name: "Slope of ST Segment", type: "number", min: 0, max: 2 },
  { name: "Major Vessels Colored by Fluoroscopy (ca)", type: "number", min: 0, max: 3 },
  { name: "Thalassemia", type: "number", min: 0, max: 3 },
  { name: "Body Mass Index (BMI)", type: "number", min: 18.5, max: 34.9, step: 0.1 },
  { name: "Smoking Status", type: "smoking" },
  { name: "Stress Level", type: "number", min: 1, max: 10 },
  { name: "Alcohol Consumption", type: "alcohol" },
  { name: "Diabetes", type: "binary" },
  { name: "Sleep Duration (hours)", type: "number", min: 0, max: 24,step: 0.1 },
];

function App() {
  const [inputs, setInputs] = useState(Array(featureInfo.length).fill(""));
  const [result, setResult] = useState(null);

  const handleChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleClear = () => {
    setInputs(Array(featureInfo.length).fill(""));
    setResult(null);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://heart-disease-predictor-i99v.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: inputs.map(Number) }),
    });
    const data = await response.json();
    setResult(data.prediction);
  };

  return (
    <div className="container">
      <h1>Heart Disease Predictor</h1>
      <form onSubmit={handleSubmit} className="form">
        {featureInfo.map((feature, index) => (
          <div key={index} className="form-group">
            <label>
              {feature.label || feature.name}
              {feature.type === "number" && feature.min !== undefined && feature.max !== undefined && (
                <span className="range-hint">({feature.min}–{feature.max})</span>
              )}
            </label>
            {feature.type === "binary" ? (
              <div className="radio-group">
                {feature.name === "Sex" ? (
                  <>
                    <label><input type="radio" name={`feature-${index}`} value="1" checked={inputs[index] === "1"} onChange={() => handleChange(index, "1")} required /> Male</label>
                    <label><input type="radio" name={`feature-${index}`} value="0" checked={inputs[index] === "0"} onChange={() => handleChange(index, "0")} required /> Female</label>
                  </>
                ) : (
                  <>
                    <label><input type="radio" name={`feature-${index}`} value="1" checked={inputs[index] === "1"} onChange={() => handleChange(index, "1")} required /> Yes</label>
                    <label><input type="radio" name={`feature-${index}`} value="0" checked={inputs[index] === "0"} onChange={() => handleChange(index, "0")} required /> No</label>
                  </>
                )}
              </div>
            ) : feature.type === "smoking" ? (
              <div className="radio-group">
                <label><input type="radio" name={`feature-${index}`} value="0" checked={inputs[index] === "0"} onChange={() => handleChange(index, "0")} required /> Non-smoker</label>
                <label><input type="radio" name={`feature-${index}`} value="1" checked={inputs[index] === "1"} onChange={() => handleChange(index, "1")} required /> Occasional smoker</label>
                <label><input type="radio" name={`feature-${index}`} value="2" checked={inputs[index] === "2"} onChange={() => handleChange(index, "2")} required /> Regular smoker</label>
              </div>
            ) : feature.type === "alcohol" ? (
              <div className="radio-group">
                <label><input type="radio" name={`feature-${index}`} value="0" checked={inputs[index] === "0"} onChange={() => handleChange(index, "0")} required /> Non-drinker</label>
                <label><input type="radio" name={`feature-${index}`} value="1" checked={inputs[index] === "1"} onChange={() => handleChange(index, "1")} required /> Occasional drinker</label>
                <label><input type="radio" name={`feature-${index}`} value="2" checked={inputs[index] === "2"} onChange={() => handleChange(index, "2")} required /> Regular drinker</label>
              </div>
            ) : (
              <input
                type="number"
                min={feature.min}
                max={feature.max}
                step={feature.step || 1}
                value={inputs[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={`Enter ${feature.name.toLowerCase()} (${feature.min}–${feature.max})`}
                required
              />
            )}
          </div>
        ))}
        <button type="submit">Predict</button>
        <button type="button" onClick={handleClear} style={{ marginLeft: "10px" }}>
  Clear
</button>
      </form>
      {result !== null && (
        <div className={`result ${result === 1 ? "high-risk" : "low-risk"}`}>
          <h2>Prediction Result:</h2>
          <p>
            {result === 1
              ? "High risk of heart disease. Please consult a doctor."
              : "Low risk of heart disease. Keep up the good work!"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
