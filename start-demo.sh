#!/bin/bash

echo "🚀 Fleet Analytics Dashboard Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the fleet-analytics-demo directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Setting up Fleet Analytics Demo...${NC}"

# Backend setup
echo -e "\n${YELLOW}🔧 Setting up Backend...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install fastapi uvicorn pandas numpy scikit-learn pydantic python-multipart

# Generate sample data if database doesn't exist
if [ ! -f "fleet_data.db" ]; then
    echo "Generating sample fleet data..."
    python3 simple_data_generator.py
fi

echo -e "${GREEN}✅ Backend setup complete!${NC}"

# Frontend setup
echo -e "\n${YELLOW}🎨 Setting up Frontend...${NC}"
cd ../frontend

# Install frontend dependencies
echo "Installing Node.js dependencies..."
npm install

echo -e "${GREEN}✅ Frontend setup complete!${NC}"

echo -e "\n${BLUE}🚀 Starting Fleet Analytics Dashboard...${NC}"
echo -e "${YELLOW}📊 Dashboard: http://localhost:3000${NC}"
echo -e "${YELLOW}🔗 API Docs: http://localhost:8000/docs${NC}"
echo -e "${YELLOW}⚡ API Server: http://localhost:8000${NC}"

# Start backend in background
echo -e "\n${BLUE}Starting API server...${NC}"
cd ../backend
source venv/bin/activate
python3 run.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo -e "\n${BLUE}Starting React development server...${NC}"
cd ../frontend
npm start &
FRONTEND_PID=$!

# Wait for user to stop
echo -e "\n${GREEN}🎉 Fleet Analytics Dashboard is now running!${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${BLUE}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped. Thanks for using Fleet Analytics!${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for background processes
wait