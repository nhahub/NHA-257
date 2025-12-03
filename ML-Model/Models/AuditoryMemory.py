import pandas as pd
import joblib
from sklearn.linear_model import Lasso
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score



class AuditoryMemory:
    def __init__(self, alpha=0.01):
        self.alpha = alpha
        self.model = Lasso(alpha=self.alpha)
        self.trained = False

    def load_data(self, file_path, target_column):
        df = pd.read_csv(file_path)
        self.X = df.drop(target_column, axis=1)
        self.y = df[target_column]
        return df

    def split_data(self, test_size=0.2, random_state=42):
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y, test_size=test_size, random_state=random_state
        )

    def train(self):
        self.model.fit(self.X_train, self.y_train)
        self.trained = True


    def evaluate(self):
        if not self.trained:
            raise Exception("Model is not trained yet.")

        y_pred = self.model.predict(self.X_test)
        mse = mean_squared_error(self.y_test, y_pred)
        r2 = r2_score(self.y_test, y_pred)

        return {"MSE": mse, "R2": r2}


    def predict(self, data):
        if not self.trained:
            raise Exception("Model is not trained yet.")
        return self.model.predict(data)


    def save_model(self, path="AuditoryMemory.pkl"):
        joblib.dump(self.model, path)


    def load_model(self, path="AuditoryMemory.pkl"):
        self.model = joblib.load(path)
        self.trained = True
