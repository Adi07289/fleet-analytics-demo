import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const fleetAPI = {
  // Fleet summary
  getFleetSummary: async () => {
    try {
      const response = await api.get('/api/fleet-summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching fleet summary:', error);
      // Return mock data if API fails
      return {
        total_vehicles: 98,
        active_vehicles: 92,
        fuel_efficiency: 28.5,
        maintenance_due: 12,
        monthly_savings: 15000
      };
    }
  },

  // Vehicles list
  getVehicles: async () => {
    try {
      const response = await api.get('/api/vehicles');
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [
        { vehicle_id: "TRK-001", type: "Truck", status: "active", fuel_efficiency: 28.5, next_maintenance: "2025-02-15" },
        { vehicle_id: "VAN-002", type: "Van", status: "active", fuel_efficiency: 32.1, next_maintenance: "2025-02-20" },
        { vehicle_id: "TRK-003", type: "Truck", status: "maintenance", fuel_efficiency: 27.8, next_maintenance: "2025-01-30" }
      ];
    }
  },

  // Fuel trends
  getFuelTrends: async () => {
    try {
      const response = await api.get('/api/fuel-trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching fuel trends:', error);
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        fuel_usage: [450, 420, 480, 390, 410, 440, 425],
        efficiency: [27.2, 28.1, 26.8, 29.2, 28.7, 28.5, 29.1]
      };
    }
  },

  // Maintenance alerts
  getMaintenanceAlerts: async () => {
    try {
      const response = await api.get('/api/maintenance-alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance alerts:', error);
      return [
        { vehicle_id: "TRK-A123", type: "Truck", next_maintenance: "2025-01-28", mileage: 45000 },
        { vehicle_id: "VAN-B456", type: "Van", next_maintenance: "2025-01-30", mileage: 38000 },
        { vehicle_id: "TRK-C789", type: "Truck", next_maintenance: "2025-02-02", mileage: 52000 }
      ];
    }
  },

  // Performance metrics
  getPerformanceMetrics: async () => {
    try {
      const response = await api.get('/api/performance-metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return {
        weekly_stats: {
          distance_covered: 15420,
          fuel_consumed: 2856,
          average_speed: 65.2,
          idle_time: 8.5
        },
        top_performers: [
          { vehicle_id: "VAN-B456", efficiency: 32.1, score: 95 },
          { vehicle_id: "TRK-C789", efficiency: 29.8, score: 92 },
          { vehicle_id: "VAN-D012", efficiency: 31.5, score: 90 }
        ],
        alerts: {
          critical: 2,
          warning: 5,
          info: 8
        }
      };
    }
  },

  // Predict maintenance
  predictMaintenance: async (vehicleId) => {
    try {
      const response = await api.post('/api/predict-maintenance', {
        vehicle_id: vehicleId
      });
      return response.data;
    } catch (error) {
      console.error('Error predicting maintenance:', error);
      return {
        vehicle_id: vehicleId,
        needs_maintenance: Math.random() > 0.5,
        probability: Math.round(Math.random() * 0.6 + 0.3, 2),
        recommended_date: "2025-02-15"
      };
    }
  },

  // AI Chat
  sendChatMessage: async (message) => {
    try {
      const response = await api.post('/api/ai-chat', {
        message: message
      });
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      return {
        response: "I'm having trouble connecting to the AI service. Please try again later."
      };
    }
  }
};

export default api;