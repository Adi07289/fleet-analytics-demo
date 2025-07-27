#!/usr/bin/env python3
"""
Fleet Analytics API Server
Run this script to start the backend server
"""

import uvicorn
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 Starting Fleet Analytics API Server...")
    print("📊 Dashboard will be available at: http://localhost:3000")
    print("🔗 API Documentation: http://localhost:8000/docs")
    print("⚡ API Endpoints: http://localhost:8000")
    print("-" * 50)
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)