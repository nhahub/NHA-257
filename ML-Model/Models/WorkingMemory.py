import numpy as np
import pandas as pd
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import joblib

class WorkingMemory:

    def __init__(self, kernel='rbf', C=10.0, epsilon=0.1, gamma='scale'):
        self.model = SVR(kernel=kernel, C=C, epsilon=epsilon, gamma=gamma)
        self.scaler = StandardScaler()
        self.trained = False

    def load_data(self, file_path, target_column):
        df = pd.read_csv(file_path)
        self.X = df.drop(target_column, axis=1).values
        self.y = df[target_column].values
        return df

    def split_data(self, test_size=0.2, random_state=42):
        return train_test_split(self.X, self.y, 
                                test_size=test_size, 
                                random_state=random_state)

    def train(self, X_train, y_train):
        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)
        self.trained = True

    def evaluate(self, X_test, y_test):
        if not self.trained:
            raise Exception("Model is not trained!")

        X_scaled = self.scaler.transform(X_test)
        y_pred = self.model.predict(X_scaled)

        return {
            "r2": r2_score(y_test, y_pred),
            "rmse": np.sqrt(mean_squared_error(y_test, y_pred)),
            "mae": mean_absolute_error(y_test, y_pred)
        }

    def predict(self, X):
        if not self.trained:
            raise Exception("Model is not trained!")
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)


    def save(self, filename="WorkingMemory.pkl"):
        joblib.dump({
            "model": self.model,
            "scaler": self.scaler
        }, filename)

    def load(self, filename="WorkingMemory.pkl"):
        data = joblib.load(filename)
        self.model = data["model"]
        self.scaler = data["scaler"]
        self.trained = True
