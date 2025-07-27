import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:8000');

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
      
      // Provide comprehensive offline responses based on message content
      const msg = message.toLowerCase();
      
      if (msg.includes('fuel') || msg.includes('efficiency')) {
        return {
          response: "🚗 **Fuel Efficiency Insights** (Demo Mode)\n\nYour fleet's current average: **28.5 MPG** (12% better than last month!)\n\n**Top Performers:**\n• VAN-B456: 32.1 MPG\n• TRK-C789: 29.8 MPG\n• VAN-D012: 31.5 MPG\n\n**Improvement Tips:**\n✓ Regular maintenance schedules\n✓ Driver training programs\n✓ Route optimization\n✓ Tire pressure monitoring"
        };
      } else if (msg.includes('maintenance')) {
        return {
          response: "🔧 **Maintenance Status** (Demo Mode)\n\n**Urgent (Due this week):**\n• TRK-A123 - Due Jan 28th\n• VAN-B456 - Due Jan 30th\n\n**Upcoming (Next 2 weeks):**\n• TRK-C789 - Due Feb 2nd\n• VAN-D012 - Due Feb 5th\n\n**Maintenance Tips:**\n✓ Preventive maintenance saves 30% on repair costs\n✓ Schedule during off-peak hours\n✓ Use certified service centers"
        };
      } else if (msg.includes('cost') || msg.includes('save')) {
        return {
          response: "💰 **Cost Optimization** (Demo Mode)\n\n**Current Monthly Costs:**\n• Fuel: $45,000\n• Maintenance: $12,000\n• Insurance: $8,000\n\n**Potential Savings:**\n🎯 Route optimization: Save $8,000/month\n🎯 Preventive maintenance: Save $5,000/month\n🎯 Fuel efficiency programs: Save $12,000/month\n\n**Total potential savings: $25,000/month**"
        };
      } else if (msg.includes('alert') || msg.includes('warning')) {
        return {
          response: "🚨 **Current Alerts** (Demo Mode)\n\n**Critical (3):**\n• TRK-A123: Engine temperature high\n• VAN-B456: Brake system check\n• TRK-C789: Oil pressure warning\n\n**Warning (5):**\n• 5 vehicles due for maintenance\n\n**Info (8):**\n• 2 vehicles below fuel efficiency targets\n• 6 route optimization opportunities"
        };
      } else if (msg.includes('performance') || msg.includes('analytics')) {
        return {
          response: "📊 **Fleet Performance** (Demo Mode)\n\n**This Week:**\n• Distance: 15,420 miles\n• Fuel consumed: 2,856 gallons\n• Average speed: 65.2 mph\n• Idle time: 8.5%\n\n**Top Performers:**\n🥇 VAN-B456 (Score: 95)\n🥈 TRK-C789 (Score: 92)\n🥉 VAN-D012 (Score: 90)\n\n**Trend:** ↗️ 15% improvement vs last month"
        };
      } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('help')) {
        return {
          response: "👋 **Welcome to Fleet Intelligence Assistant!** (Demo Mode)\n\nI can help you with:\n\n🚗 **Fleet Analytics** - Performance metrics and insights\n🔧 **Maintenance** - Scheduling and predictions\n⛽ **Fuel Efficiency** - Optimization and tracking\n💰 **Cost Analysis** - Savings opportunities\n🚨 **Alerts & Monitoring** - Real-time notifications\n📊 **Reporting** - Custom analytics\n\n*Try asking: \"How is fuel efficiency?\" or \"What maintenance is due?\"*"
        };
      } else {
        return {
          response: "🤖 **AI Assistant** (Demo Mode)\n\nI can help with fleet management queries! Try asking about:\n\n• **Fuel efficiency** - \"How is our fuel efficiency?\"\n• **Maintenance** - \"What vehicles need maintenance?\"\n• **Costs** - \"Show me cost analysis\"\n• **Performance** - \"How is fleet performance?\"\n• **Alerts** - \"What are current alerts?\"\n\n*This is a demo with simulated data for testing purposes.*"
        };
      }
    }
  }
};

export default api;