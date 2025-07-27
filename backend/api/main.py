from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import json
import random
from typing import List, Dict, Any

app = FastAPI(title="Fleet Analytics API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

class MaintenanceRequest(BaseModel):
    vehicle_id: str

# Mock data for serverless deployment
MOCK_VEHICLES = [
    {"vehicle_id": "TRK-001", "type": "Truck", "status": "active", "fuel_efficiency": 28.5, "next_maintenance": "2025-02-15", "mileage": 45000},
    {"vehicle_id": "VAN-002", "type": "Van", "status": "active", "fuel_efficiency": 32.1, "next_maintenance": "2025-02-20", "mileage": 38000},
    {"vehicle_id": "TRK-003", "type": "Truck", "status": "maintenance", "fuel_efficiency": 27.8, "next_maintenance": "2025-01-30", "mileage": 52000},
    {"vehicle_id": "VAN-004", "type": "Van", "status": "active", "fuel_efficiency": 30.2, "next_maintenance": "2025-02-10", "mileage": 41000},
    {"vehicle_id": "CAR-005", "type": "Car", "status": "active", "fuel_efficiency": 35.1, "next_maintenance": "2025-02-25", "mileage": 28000},
    {"vehicle_id": "BUS-006", "type": "Bus", "status": "active", "fuel_efficiency": 18.5, "next_maintenance": "2025-02-05", "mileage": 67000},
    {"vehicle_id": "TRK-007", "type": "Truck", "status": "active", "fuel_efficiency": 26.8, "next_maintenance": "2025-02-18", "mileage": 49000},
    {"vehicle_id": "VAN-008", "type": "Van", "status": "inactive", "fuel_efficiency": 31.5, "next_maintenance": "2025-03-01", "mileage": 35000}
]

MOCK_MAINTENANCE_ALERTS = [
    {"vehicle_id": "TRK-A123", "type": "Truck", "next_maintenance": "2025-01-28", "mileage": 45000},
    {"vehicle_id": "VAN-B456", "type": "Van", "next_maintenance": "2025-01-30", "mileage": 38000},
    {"vehicle_id": "TRK-C789", "type": "Truck", "next_maintenance": "2025-02-02", "mileage": 52000}
]

@app.get("/")
async def root():
    return {"message": "Fleet Analytics API", "status": "running"}

@app.get("/api/fleet-summary")
def fleet_summary():
    """Get fleet overview statistics"""
    active_vehicles = len([v for v in MOCK_VEHICLES if v["status"] == "active"])
    avg_efficiency = sum(v["fuel_efficiency"] for v in MOCK_VEHICLES if v["status"] == "active") / active_vehicles
    maintenance_due = len([v for v in MOCK_VEHICLES if (datetime.strptime(v["next_maintenance"], "%Y-%m-%d") - datetime.now()).days <= 7])
    
    return {
        "total_vehicles": len(MOCK_VEHICLES),
        "active_vehicles": active_vehicles,
        "fuel_efficiency": round(avg_efficiency, 1),
        "maintenance_due": maintenance_due,
        "monthly_savings": 15000
    }

@app.get("/api/vehicles")
def get_vehicles():
    """Get list of all vehicles"""
    return MOCK_VEHICLES

@app.get("/api/fuel-trends")
def fuel_trends():
    """Get fuel consumption trends for the last 7 days"""
    dates = [(datetime.now() - timedelta(days=i)).strftime("%a") for i in range(6, -1, -1)]
    return {
        "labels": dates,
        "fuel_usage": [450, 420, 480, 390, 410, 440, 425],
        "efficiency": [27.2, 28.1, 26.8, 29.2, 28.7, 28.5, 29.1]
    }

@app.get("/api/maintenance-alerts")
def maintenance_alerts():
    """Get vehicles due for maintenance"""
    return MOCK_MAINTENANCE_ALERTS

@app.get("/api/performance-metrics")
def performance_metrics():
    """Get detailed performance metrics"""
    return {
        "weekly_stats": {
            "distance_covered": 15420,
            "fuel_consumed": 2856,
            "average_speed": 65.2,
            "idle_time": 8.5
        },
        "top_performers": [
            {"vehicle_id": "VAN-B456", "efficiency": 32.1, "score": 95},
            {"vehicle_id": "TRK-C789", "efficiency": 29.8, "score": 92},
            {"vehicle_id": "VAN-D012", "efficiency": 31.5, "score": 90}
        ],
        "alerts": {
            "critical": 2,
            "warning": 5,
            "info": 8
        }
    }

@app.post("/api/predict-maintenance")
def predict_maintenance(request: MaintenanceRequest):
    """Predict maintenance needs for a specific vehicle"""
    vehicle = next((v for v in MOCK_VEHICLES if v["vehicle_id"] == request.vehicle_id), None)
    
    if not vehicle:
        return {
            "vehicle_id": request.vehicle_id,
            "needs_maintenance": random.choice([True, False]),
            "probability": round(random.uniform(0.3, 0.9), 2),
            "recommended_date": "2025-02-15"
        }
    
    # Simple risk calculation based on mileage and maintenance date
    days_until = (datetime.strptime(vehicle["next_maintenance"], "%Y-%m-%d") - datetime.now()).days
    mileage_factor = min(vehicle["mileage"] / 50000, 1.0)  # Normalize to 50k miles
    time_factor = max(0, (30 - days_until) / 30)  # Risk increases as maintenance date approaches
    
    risk_score = (mileage_factor * 0.4) + (time_factor * 0.6)
    needs_maintenance = risk_score > 0.7 or days_until <= 7
    
    next_date = (datetime.now() + timedelta(days=max(7, 30 - int(risk_score * 30)))).strftime("%Y-%m-%d")
    
    return {
        "vehicle_id": request.vehicle_id,
        "needs_maintenance": needs_maintenance,
        "probability": round(min(risk_score, 0.95), 2),
        "recommended_date": next_date,
        "risk_factors": {
            "mileage": vehicle["mileage"],
            "days_until_maintenance": days_until
        }
    }

@app.post("/api/ai-chat")
def ai_chat(request: ChatMessage):
    """AI chat assistant for fleet management"""
    message = request.message.lower()
    
    responses = {
        "fuel": "Your fleet's average fuel efficiency is 28.5 MPG, which is 12% better than last month! Top performers include VAN-B456 (32.1 MPG) and TRK-C789 (29.8 MPG).",
        "efficiency": "To improve fuel efficiency, consider: 1) Regular maintenance schedules 2) Driver training programs 3) Route optimization 4) Tire pressure monitoring.",
        "maintenance": "You have 12 vehicles due for maintenance in the next 2 weeks. The most urgent are TRK-A123 (due Jan 28) and VAN-B456 (due Jan 30). Would you like me to schedule these?",
        "cost": "Current monthly fleet costs: Fuel $45,000, Maintenance $12,000, Insurance $8,000. You're saving $15,000/month vs. last year through optimization.",
        "save": "Top cost-saving opportunities: 1) Route optimization could save $8,000/month 2) Preventive maintenance saves $5,000/month 3) Fuel efficiency programs save $12,000/month.",
        "alert": "Current alerts: 3 vehicles need immediate attention, 5 are due for maintenance, and 2 have fuel efficiency below targets.",
        "hello": "Hello! I'm your Fleet Intelligence Assistant. I can help with fuel efficiency, maintenance scheduling, cost optimization, and fleet analytics. What would you like to know?",
        "help": "I can assist with: \n• Fleet performance analytics\n• Maintenance predictions\n• Fuel efficiency optimization\n• Cost analysis and savings\n• Vehicle status and alerts\n\nWhat specific area interests you?"
    }
    
    for key in responses:
        if key in message:
            return {"response": responses[key]}
    
    return {"response": "I can help you with fuel efficiency, maintenance schedules, cost optimization, and fleet analytics. Could you be more specific about what you'd like to know?"}

# Handler for Vercel - this is the entry point for serverless functions
from mangum import Mangum

handler = Mangum(app)