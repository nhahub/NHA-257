import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import numpy as np

from VisualMemory import VisualMemory
from WorkingMemory import WorkingMemory
from AuditoryMemory import AuditoryMemory
from EpisodicMemory import EpisodicMemory




def evaluate_model(model, X_test, y_test, name):

    preds = model.predict(X_test)

    r2 = r2_score(y_test, preds)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))

    print(f"\n===== {name} Model Metrics =====")
    print(f"R² Score : {r2:.4f}")
    print(f"MAE      : {mae:.4f}")
    print(f"RMSE     : {rmse:.4f}")

    return preds


def train_memory_model(model_class, df, target_col, save_name):

    print(f"\n  {save_name}...")

    X = df.drop(columns=[target_col])
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = model_class()
    model.train(X_train, y_train)

    evaluate_model(model, X_test, y_test, save_name)

    model.save_model(f"{save_name}.pkl")

    print(f"Saved: {save_name}.pkl\n")

    return model


def main():

    print("\n Loading dataset...")
    df = pd.read_csv(r"E:/ML/Data.csv")


    print(" Data loaded successfully!")
    print(df.head())


    df = df.rename(columns={
    'prOOOPos': 'pre_Visual',
    'prCR': 'pre_Working',
    'prLR': 'pre_Auditory',
    'prVSP':'pre_Episodic',
    'poOOOPos' :'post_Visual',
    'poCR':'post_Working',
    'poLR':'post_Auditory',
    'poVSP':'post_Episodic'
        })
    
    Targets = ['Visual', 'Working', 'Auditory', 'Episodic']

    for i in Targets:
        df[f'improvement_{i}'] = df[f'post_{i}'] - df[f'pre_{i}']


    train_memory_model(
        VisualMemoryModel,
        df,
        target_col="improvement_Visual",      
        save_name="visual_memory_model"
    )

    train_memory_model(
        WorkingMemoryModel,
        df,
        target_col="improvement_Working",       
        save_name="working_memory_model"
    )

    train_memory_model(
        AuditoryMemoryModel,
        df,
        target_col="improvement_Auditory",      
        save_name="auditory_memory_model"
    )

    train_memory_model(
        EpisodicMemoryModel,
        df,
        target_col="improvement_Episodic",      
        save_name="episodic_memory_model"
    )

    print("\n All models trained & saved successfully! Ready for deployment")


if __name__ == "__main__":
    main()
