import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from scipy.stats import spearmanr
import joblib
import warnings
warnings.filterwarnings('ignore')

class EpisodicDataPreprocessor:
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.feature_names = None
        self.is_fitted = False
        
    def create_features(self, df):

        df_new = df.copy()
        
        if 'pre_Episodic' in df_new.columns:
            # Polynomial features
            df_new['pre_Episodic_squared'] = df_new['pre_Episodic'] ** 2
            df_new['pre_Episodic_cubed'] = df_new['pre_Episodic'] ** 3
            df_new['pre_Episodic_sqrt'] = np.sqrt(np.abs(df_new['pre_Episodic']))
            

        return df_new
    
    def fit(self, df):

        df_processed = self.create_features(df)
        
        numeric_cols = df_processed.select_dtypes(include=[np.number]).columns.tolist()
        
        target_cols = ['post_Episodic', 'improvement_Episodic']
        numeric_cols = [col for col in numeric_cols if col not in target_cols]
        
        self.feature_names = numeric_cols
        
        if len(numeric_cols) > 0:
            self.scaler.fit(df_processed[numeric_cols])
        
        self.is_fitted = True
        return self
    
    def transform(self, df):

        if not self.is_fitted:
            raise ValueError("Preprocessor must be fitted before transform!")
        
        df_processed = self.create_features(df)
        
        if self.feature_names and len(self.feature_names) > 0:
            df_processed[self.feature_names] = self.scaler.transform(df_processed[self.feature_names])
        
        return df_processed
    
    def fit_transform(self, df):
        self.fit(df)
        return self.transform(df)
    
class EpisodicImprovementModel:
    
    def __init__(self, n_estimators=400, max_depth=15, random_state=42):
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=8,
            min_samples_leaf=4,
            max_features='sqrt',
            random_state=random_state,
            n_jobs=-1
        )
        self.preprocessor = EpisodicDataPreprocessor()
        self.feature_importance = None
        self.is_trained = False
        
    def prepare_features(self, df):

        exclude_cols = ['post_Episodic', 'improvement_Episodic']
        feature_cols = [col for col in df.columns if col not in exclude_cols]
        
        return df[feature_cols]
    
    def fit(self, df, target_col='improvement_Episodic'):

        df_processed = self.preprocessor.fit_transform(df)
        
        X = self.prepare_features(df_processed)
        y = df[target_col]
        
        self.model.fit(X, y)
        
        self.feature_importance = pd.DataFrame({
            'feature': X.columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        self.is_trained = True
        
        return self
    
    def predict(self, df):

        if not self.is_trained:
            raise ValueError("Model must be trained first!")
        
        df_processed = self.preprocessor.transform(df)
        
        X = self.prepare_features(df_processed)
        
        predictions = self.model.predict(X)
        
        return predictions
    
    def evaluate(self, df, target_col='improvement_Episodic'):

        y_pred = self.predict(df)
        y_true = df[target_col]
        
        # حساب المقاييس
        metrics = {
            'r2': r2_score(y_true, y_pred),
            'rmse': np.sqrt(mean_squared_error(y_true, y_pred)),
            'mae': mean_absolute_error(y_true, y_pred),
            'spearman': spearmanr(y_true, y_pred)[0]
        }
        
        return metrics, y_pred
    
    def save(self, filename='episodic_improvement_model.pkl'):
    
        model_data = {
            'model': self.model,
            'preprocessor': self.preprocessor,
            'feature_importance': self.feature_importance,
            'is_trained': self.is_trained
        }
        joblib.dump(model_data, filename)
        print(f" Model saved: {filename}")
    
    @staticmethod
    def load(filename='episodic_improvement_model.pkl'):
    
        model_data = joblib.load(filename)
        
        model = EpisodicImprovementModel()
        model.model = model_data['model']
        model.preprocessor = model_data['preprocessor']
        model.feature_importance = model_data['feature_importance']
        model.is_trained = model_data['is_trained']
        
        return model


def train_and_evaluate_model(df, test_size=0.2, random_state=42):

    train_df, test_df = train_test_split(df, test_size=test_size, random_state=random_state)
    print(f"  • Training samples: {len(train_df)}")
    print(f"  • Testing samples:  {len(test_df)}")
    
    model = EpisodicImprovementModel(n_estimators=400, random_state=random_state)
    model.fit(train_df, target_col='improvement_Episodic')

    print("\n Results of Train")
    train_metrics, train_pred = model.evaluate(train_df)
    print(f"  • R²:       {train_metrics['r2']:.4f}")
    print(f"  • RMSE:     {train_metrics['rmse']:.4f}")
    print(f"  • MAE:      {train_metrics['mae']:.4f}")
    print(f"  • Spearman: {train_metrics['spearman']:.4f}")
    
    print("\n Results of Test")
    test_metrics, test_pred = model.evaluate(test_df)
    print(f"  • R²:       {test_metrics['r2']:.4f}")
    print(f"  • RMSE:     {test_metrics['rmse']:.4f}")
    print(f"  • MAE:      {test_metrics['mae']:.4f}")
    print(f"  • Spearman: {test_metrics['spearman']:.4f}")
    
    print("\n🔄 Cross-Validation (5-fold)...")
    df_processed = model.preprocessor.transform(train_df)
    X = model.prepare_features(df_processed)
    y = train_df['improvement_Episodic']
    cv_scores = cross_val_score(model.model, X, y, cv=5, scoring='r2', n_jobs=-1)
    print(f"  • CV R² Mean: {cv_scores.mean():.4f}")
    print(f"  • CV R² Std:  {cv_scores.std():.4f}")
    
    print("\n Best Features")
    print(model.feature_importance.head(5).to_string(index=False))
    
    model.save('episodic_model.pkl')
    
    print("Done!")
    
    results = {
        'train_metrics': train_metrics,
        'test_metrics': test_metrics,
        'cv_scores': cv_scores,
        'feature_importance': model.feature_importance
    }
    
    return model, results

