import sqlite3
import random
from datetime import datetime, timedelta

def create_simple_database():
    """Create SQLite database with sample fleet data (no pandas dependency)"""
    conn = sqlite3.connect('fleet_data.db')
    cursor = conn.cursor()
    
    # Create vehicles table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vehicles (
            vehicle_id TEXT PRIMARY KEY,
            type TEXT,
            status TEXT,
            mileage INTEGER,
            fuel_efficiency REAL,
            last_maintenance DATE,
            next_maintenance DATE
        )
    ''')
    
    # Create fuel_data table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS fuel_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vehicle_id TEXT,
            date DATE,
            fuel_consumed REAL,
            distance_traveled REAL,
            fuel_efficiency REAL,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id)
        )
    ''')
    
    # Generate vehicle data
    vehicle_types = ['Truck', 'Van', 'Car', 'Bus']
    statuses = ['active', 'maintenance', 'inactive']
    
    vehicles = []
    for i in range(100):
        vehicle_id = f"{random.choice(['TRK', 'VAN', 'CAR', 'BUS'])}-{str(i+1).zfill(3)}"
        vehicle_type = random.choice(vehicle_types)
        
        # Weighted random status
        rand_status = random.random()
        if rand_status < 0.85:
            status = 'active'
        elif rand_status < 0.95:
            status = 'maintenance'
        else:
            status = 'inactive'
        
        # Base efficiency by vehicle type
        base_efficiency = {
            'Truck': 25, 'Van': 30, 'Car': 35, 'Bus': 18
        }
        
        efficiency = base_efficiency[vehicle_type] + random.uniform(-3, 5)
        mileage = random.randint(15000, 80000)
        
        last_maintenance = datetime.now() - timedelta(days=random.randint(10, 180))
        next_maintenance = last_maintenance + timedelta(days=random.randint(30, 120))
        
        vehicles.append((
            vehicle_id,
            vehicle_type,
            status,
            mileage,
            round(efficiency, 1),
            last_maintenance.strftime('%Y-%m-%d'),
            next_maintenance.strftime('%Y-%m-%d')
        ))
    
    # Insert vehicles
    cursor.executemany('''
        INSERT OR REPLACE INTO vehicles 
        (vehicle_id, type, status, mileage, fuel_efficiency, last_maintenance, next_maintenance)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', vehicles)
    
    # Generate fuel data for last 30 days
    fuel_data = []
    for vehicle in vehicles[:50]:  # Generate data for first 50 vehicles
        vehicle_id = vehicle[0]
        vehicle_status = vehicle[2]
        base_efficiency = vehicle[4]
        
        for day in range(30):
            date = (datetime.now() - timedelta(days=day)).strftime('%Y-%m-%d')
            
            # Daily distance and fuel consumption
            if vehicle_status == 'active':
                distance = random.uniform(100, 400)  # km per day
                daily_efficiency = base_efficiency + random.uniform(-2, 2)
                fuel_consumed = distance / daily_efficiency if daily_efficiency > 0 else 0
            else:
                distance = 0
                fuel_consumed = 0
                daily_efficiency = 0
            
            fuel_data.append((
                vehicle_id,
                date,
                round(fuel_consumed, 2),
                round(distance, 1),
                round(daily_efficiency, 1)
            ))
    
    # Insert fuel data
    cursor.executemany('''
        INSERT OR REPLACE INTO fuel_data 
        (vehicle_id, date, fuel_consumed, distance_traveled, fuel_efficiency)
        VALUES (?, ?, ?, ?, ?)
    ''', fuel_data)
    
    conn.commit()
    conn.close()
    print("Database created successfully with sample data!")
    print(f"Generated {len(vehicles)} vehicles and {len(fuel_data)} fuel records")

if __name__ == "__main__":
    create_simple_database()