# Fleet Analytics Dashboard

A comprehensive fleet management dashboard showcasing modern web development, data visualization, machine learning integration, and AI-powered insights for fleet management.

## 🚀 Project Overview

This dashboard provides real-time fleet analytics including:
- **Fleet Performance Monitoring** - Track vehicle status, fuel efficiency, and operational metrics
- **Predictive Maintenance** - AI-powered maintenance scheduling and risk assessment
- **Interactive Data Visualization** - Charts and graphs for fuel trends, performance metrics
- **AI Chat Assistant** - Natural language interface for fleet insights
- **Cost Optimization** - Identify savings opportunities and efficiency improvements

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLite** - Lightweight database for development
- **scikit-learn** - Machine learning models for predictions
- **Pandas & NumPy** - Data processing and analysis

### Frontend
- **React 18** - Modern frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - React chart library for data visualization
- **Axios** - HTTP client for API communication

## 📁 Project Structure

```
fleet-analytics-demo/
├── backend/
│   ├── main.py                 # FastAPI application with all endpoints
│   ├── models.py               # ML models for predictions
│   ├── data_generator.py       # Generate sample fleet data
│   ├── simple_data_generator.py # Simplified data generation (no pandas)
│   ├── requirements.txt        # Python dependencies
│   └── fleet_data.db          # SQLite database (generated)
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React application
│   │   ├── api.js             # API integration layer
│   │   ├── components/
│   │   │   ├── Dashboard.js   # Main dashboard with metrics
│   │   │   ├── Charts.js      # Data visualization components
│   │   │   ├── AIChat.js      # AI assistant interface
│   │   │   └── Maintenance.js # Maintenance management
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles with Tailwind
│   ├── package.json           # Node.js dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── public/
├── README.md
└── demo_screenshots/
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd fleet-analytics-demo/backend
   ```

2. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Generate sample data:**
   ```bash
   python simple_data_generator.py
   ```

5. **Start the API server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at: http://localhost:8000
   API documentation: http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd fleet-analytics-demo/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The application will be available at: http://localhost:3000

## 📊 Features

### Dashboard
- **Fleet Summary Cards** - Total vehicles, active count, fuel efficiency, maintenance alerts
- **Interactive Charts** - Fuel trends, weekly performance, fleet composition
- **Vehicle Table** - Real-time status of all vehicles
- **Performance Metrics** - Weekly stats, top performers, alert summary

### Maintenance Management
- **Maintenance Schedule** - Upcoming maintenance with urgency indicators
- **AI Predictions** - Machine learning-powered maintenance forecasting
- **Risk Assessment** - Probability-based maintenance recommendations
- **Status Filtering** - Filter by urgent, overdue, or scheduled maintenance

### AI Assistant
- **Natural Language Interface** - Ask questions about fleet performance
- **Quick Actions** - Pre-built queries for common tasks
- **Real-time Responses** - Instant insights and recommendations
- **Fleet Optimization Tips** - Cost-saving and efficiency suggestions

## 🔌 API Endpoints

### Fleet Data
- `GET /api/fleet-summary` - Overall fleet statistics
- `GET /api/vehicles` - List of all vehicles
- `GET /api/fuel-trends` - Weekly fuel consumption data
- `GET /api/maintenance-alerts` - Vehicles due for maintenance
- `GET /api/performance-metrics` - Detailed performance analytics

### AI & Predictions
- `POST /api/predict-maintenance` - ML-powered maintenance predictions
- `POST /api/ai-chat` - AI assistant chat interface

## 🤖 Machine Learning Features

### Fuel Efficiency Predictor
- **Linear Regression Model** - Predicts fuel efficiency based on vehicle data
- **Features** - Vehicle type, mileage, maintenance history
- **Training** - Uses historical fleet data for accurate predictions

### Maintenance Predictor
- **Risk Assessment** - Combines mileage and time-based factors
- **Threshold Logic** - Intelligent maintenance scheduling
- **Probability Scoring** - Risk percentage for maintenance needs

### Anomaly Detection
- **Isolation Forest** - Detects unusual fuel consumption patterns
- **Pattern Recognition** - Identifies vehicles requiring attention
- **Alert Generation** - Automatic notifications for anomalies

## 🎨 Design Features

### Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Professional Branding** - Clean blue color scheme with modern design
- **Smooth Animations** - Fade-in effects and hover interactions
- **Accessible Interface** - Clear typography and intuitive navigation

### Data Visualization
- **Interactive Charts** - Recharts library for dynamic graphs
- **Color Coding** - Status indicators and urgency levels
- **Real-time Updates** - Live data refresh and updates
- **Export Ready** - Charts and data ready for presentations

## 🚀 Deployment

### Production Build

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve static files** through your web server or CDN

3. **Deploy backend** to your preferred platform (AWS, Heroku, etc.)

4. **Environment Variables:**
   ```bash
   REACT_APP_API_URL=https://your-api-domain.com
   ```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/  # If tests are implemented
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🔧 Development Notes

### Data Generation
- Sample database includes 100 vehicles and 30 days of data
- Realistic fuel consumption patterns and maintenance schedules
- Configurable vehicle types and performance parameters

### API Integration
- Graceful error handling with fallback mock data
- CORS enabled for development
- Request timeout and retry logic

### Scalability Considerations
- SQLite for development, easily upgradeable to PostgreSQL
- API pagination ready for large datasets
- Component-based architecture for easy feature additions

## 🎯 Demo Highlights

This project demonstrates:

1. **Full-Stack Development** - Complete application from database to UI
2. **Data Science Integration** - ML models integrated into web application
3. **Modern Frontend** - React with Tailwind CSS and responsive design
4. **API Design** - RESTful API with comprehensive documentation
5. **Business Logic** - Real-world fleet management scenarios
6. **AI Integration** - Natural language interface for fleet insights

## 👨‍💻 About

This project demonstrates professional-level development skills and showcases:
- Problem-solving and system design skills
- Modern web development proficiency
- Data science and ML implementation
- Business understanding of fleet management
- Ability to deliver complete solutions

## 📝 License

This project is created for educational and demonstration purposes.

---

**Fleet Analytics Dashboard** - Intelligent Fleet Management for the Modern Era