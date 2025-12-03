import pickle
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

class VisualMemory:
    def __init__(self):
        self.model = None

    def train(self, X_train, y_train):

        self.model = GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=3,
            subsample=0.9,
            random_state=42
        )
        self.model.fit(X_train, y_train)
        return self.model

    def predict(self, X):

        if self.model is None:
            raise ValueError("Model is not trained yet.")
        return self.model.predict(X)

    def save_model(self, path="gradient_boosting_model.pkl"):

        if self.model is None:
            raise ValueError("Model is not trained yet.")
        with open(path, "wb") as f:
            pickle.dump(self.model, f)

    def load_model(self, path="gradient_boosting_model.pkl"):

        with open(path, "rb") as f:
            self.model = pickle.load(f)
        return self.model
