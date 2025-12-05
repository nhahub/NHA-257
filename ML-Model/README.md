# 🧠 Cognitive Memory Prediction Models

A Machine Learning Toolkit for Auditory, Episodic, Visual & Working Memory Prediction

This repository contains four production-ready machine learning models designed to analyze cognitive performance and predict memory improvement based on real-world assessment data.
Each model focuses on a different cognitive domain and provides:

* Automated preprocessing

* Feature engineering

* Model training & evaluation

* Prediction and inference

* Model saving/loading

* Suggestions based on model outputs

The project is modular, easy to integrate, and ready for deployment.
#

# 🚀 Project Overview

This system includes four independent ML models, each optimized for a specific type of memory performance:

**Model	Algorithm	Purpose**

* AuditoryMemory	Lasso Regression	Predict auditory memory scores & improvement

* EpisodicMemory	Random Forest + Preprocessor	Predict episodic memory improvement with advanced feature engineering

* VisualMemory	Gradient Boosting Regressor	Predict visual memory performance

* WorkingMemory	Support Vector Regression (SVR)	Predict working memory performance using scaled features

**Each model includes methods for:**

* Loading data

* Training

* Evaluating with metrics

* Predicting new samples

* Model persistence (save/load)

#

# 🧠 Models Breakdown

**🔊 1. AuditoryMemory Model (Lasso Regression)**

A lightweight regression model suitable for small datasets and interpretable coefficients.

✨ Features:

* Simple, fast training

* Supports .csv input directly

* Metrics: MSE, R²

* Save & load with joblib

**🧩 2. EpisodicImprovementModel (Random Forest + Preprocessing)**

The most advanced model in the project.
**It includes:**

**🧹 Automated Preprocessing**

* Polynomial features

* Square root transforms

* Scaling

* Smart feature selection

**🌲 Model Capabilities**

* Random Forest with tuned hyperparameters

* Spearman correlation evaluation

* Cross-validation

* Feature importance ranking

**📦 Saving**

* Saves both model + preprocessor in one .pkl file.
  

**👁 3. VisualMemory Model (Gradient Boosting)**


A strong regression model for structured cognitive data.

**Highlights:**

* Gradient Boosting (200 trees)

* Handles non-linear relationships

* Fast inference

* Very stable for medium-size datasets


**🧮 4. WorkingMemory Model (SVR)**


Uses Support Vector Regression for high-accuracy predictions.

**Includes:**

* StandardScaler fitting

* Kernel-based learning

* Clean API for training, evaluation, and inference

# 📊 Evaluation Metrics

Each model provides one or more of the following:

* R² Score

* RMSE – Root Mean Squared Error

* MAE – Mean Absolute Error

* Spearman Rank Correlation

* MSE – Mean Squared Error

# 📥 Installation
git clone [https://github.com/nhahub/NHA-257/edit/last/ML-Model]

cd ML-Model

pip install -r Requirements.txt

# 📚 Usage Examples
▶️ Train a Model (Example: Auditory)

from Models.AuditoryMemory import AuditoryMemory

model = AuditoryMemory(alpha=0.01)

df = model.load_data("Data.csv", target_column="Auditory_Score")

model.split_data()

model.train()

print(model.evaluate())

model.save("TrainedModel/auditory_memory_model.pkl")

▶️ Predict New Values (Working Memory)
from Models.WorkingMemory import WorkingMemory

import numpy as np

wm = WorkingMemory()

wm.load("TrainedModel/working_memory_model.pkl")

sample = np.array([[3, 5, 12]])

prediction = wm.predict(sample)

print("Predicted Working Memory Score:", prediction)

# 🧪 Training All Models at Once

Run the global training script:

python train_all.py

# 💡 Model-Based Recommendations (Suggestions)

Based on predicted memory scores, the system can provide:

Cognitive training recommendations

Skill-targeted exercises

Alerts for low performance

Improvement tracking over time

This section can be extended inside App.py.

# 📈 Future Enhancements

API deployment using FastAPI

Dashboard analytics (Streamlit / Dash)

Auto-hyperparameter tuning

Explainability using SHAP

Model monitoring with drift detection

# 🤝 Contributing

Contributions are welcome!

Open a PR or create an issue if you want to improve or extend the project.
