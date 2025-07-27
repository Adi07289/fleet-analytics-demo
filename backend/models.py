import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import sqlite3
from datetime import datetime, timedelta
import pickle

class FuelEfficiencyPredictor:
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_features(self, data):
        """Prepare features for fuel efficiency prediction"""
        features = pd.DataFrame()
        features['mileage'] = data['mileage']
        features['days_since_maintenance'] = (
            pd.to_datetime('today') - pd.to_datetime(data['last_maintenance'])
        ).dt.days
        features['vehicle_type_encoded'] = pd.factorize(data['type'])[0]
        return features
    
    def train(self, db_path='fleet_data.db'):
        """Train the fuel efficiency model"""
        try:
            conn = sqlite3.connect(db_path)
            
            # Get vehicle data with recent fuel efficiency
            query = """
                SELECT v.*, AVG(f.fuel_efficiency) as avg_efficiency
                FROM vehicles v
                JOIN fuel_data f ON v.vehicle_id = f.vehicle_id
                WHERE f.date >= date('now', '-30 days')
                GROUP BY v.vehicle_id
            """
            
            data = pd.read_sql_query(query, conn)
            conn.close()
            
            if len(data) < 10:
                return False
            
            X = self.prepare_features(data)
            y = data['avg_efficiency']
            
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            self.is_trained = True
            return True
            
        except Exception as e:
            print(f"Training error: {e}")
            return False
    
    def predict(self, vehicle_data):
        """Predict fuel efficiency for a vehicle"""
        if not self.is_trained:
            return None
        
        try:
            features = self.prepare_features(pd.DataFrame([vehicle_data]))
            features_scaled = self.scaler.transform(features)
            prediction = self.model.predict(features_scaled)[0]
            return round(prediction, 2)
        except Exception as e:
            print(f"Prediction error: {e}")
            return None

class MaintenancePredictor:
    def __init__(self):
        self.maintenance_intervals = {
            'Truck': 5000,    # miles
            'Van': 6000,
            'Car': 7500,
            'Bus': 4000
        }
        self.time_intervals = {
            'Truck': 90,      # days
            'Van': 120,
            'Car': 180,
            'Bus': 60
        }
    
    def predict_maintenance_need(self, vehicle_data):
        """Predict if vehicle needs maintenance soon"""
        vehicle_type = vehicle_data.get('type', 'Truck')
        current_mileage = vehicle_data.get('mileage', 0)
        last_maintenance_date = vehicle_data.get('last_maintenance')
        
        # Calculate mileage since last maintenance (estimate)
        estimated_daily_miles = 150  # average daily miles
        days_since_maintenance = (
            datetime.now() - datetime.strptime(last_maintenance_date, '%Y-%m-%d')
        ).days
        
        miles_since_maintenance = days_since_maintenance * estimated_daily_miles
        
        # Check mileage-based maintenance need
        mileage_interval = self.maintenance_intervals.get(vehicle_type, 5000)
        mileage_ratio = miles_since_maintenance / mileage_interval
        
        # Check time-based maintenance need
        time_interval = self.time_intervals.get(vehicle_type, 90)
        time_ratio = days_since_maintenance / time_interval
        
        # Combined risk score
        risk_score = max(mileage_ratio, time_ratio)
        
        return {
            'needs_maintenance': risk_score > 0.8,
            'risk_score': min(risk_score, 1.0),
            'days_until_maintenance': max(0, time_interval - days_since_maintenance),
            'miles_until_maintenance': max(0, mileage_interval - miles_since_maintenance)
        }

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train(self, db_path='fleet_data.db'):
        """Train anomaly detection model"""
        try:
            conn = sqlite3.connect(db_path)
            
            query = """
                SELECT vehicle_id, fuel_efficiency, fuel_consumed, distance_traveled
                FROM fuel_data
                WHERE date >= date('now', '-30 days')
                AND fuel_efficiency > 0
            """
            
            data = pd.read_sql_query(query, conn)
            conn.close()
            
            if len(data) < 50:
                return False
            
            features = data[['fuel_efficiency', 'fuel_consumed', 'distance_traveled']]
            features_scaled = self.scaler.fit_transform(features)
            
            self.model.fit(features_scaled)
            self.is_trained = True
            return True
            
        except Exception as e:
            print(f"Anomaly detection training error: {e}")
            return False
    
    def detect_anomalies(self, data):
        """Detect anomalous fuel consumption patterns"""
        if not self.is_trained:
            return []
        
        try:
            features = data[['fuel_efficiency', 'fuel_consumed', 'distance_traveled']]
            features_scaled = self.scaler.transform(features)
            
            anomaly_scores = self.model.decision_function(features_scaled)
            is_anomaly = self.model.predict(features_scaled) == -1
            
            anomalies = []
            for idx, (vehicle_id, score, is_anom) in enumerate(
                zip(data['vehicle_id'], anomaly_scores, is_anomaly)
            ):
                if is_anom:
                    anomalies.append({
                        'vehicle_id': vehicle_id,
                        'anomaly_score': float(score),
                        'severity': 'high' if score < -0.5 else 'medium'
                    })
            
            return anomalies
            
        except Exception as e:
            print(f"Anomaly detection error: {e}")
            return []

def initialize_models():
    """Initialize and train all ML models"""
    fuel_predictor = FuelEfficiencyPredictor()
    maintenance_predictor = MaintenancePredictor()
    anomaly_detector = AnomalyDetector()
    
    print("Training fuel efficiency predictor...")
    fuel_predictor.train()
    
    print("Training anomaly detector...")
    anomaly_detector.train()
    
    print("Models initialized successfully!")
    
    return {
        'fuel_predictor': fuel_predictor,
        'maintenance_predictor': maintenance_predictor,
        'anomaly_detector': anomaly_detector
    }

if __name__ == "__main__":
    models = initialize_models()