import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import Maintenance from './components/Maintenance';
import { fleetAPI } from './api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [summary, vehicles, fuelTrends, maintenanceAlerts] = await Promise.all([
          fleetAPI.getFleetSummary(),
          fleetAPI.getVehicles(),
          fleetAPI.getFuelTrends(),
          fleetAPI.getMaintenanceAlerts()
        ]);

        setFleetData({
          summary,
          vehicles,
          fuelTrends,
          maintenanceAlerts
        });
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' },
    { id: 'chat', name: 'AI Assistant', icon: '🤖' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading Fleet Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">FleetOps</h1>
                <p className="text-xs text-gray-500">Fleet Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{fleetData?.summary?.active_vehicles || 0}</span> Active Vehicles
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'dashboard' && <Dashboard fleetData={fleetData} />}
          {activeTab === 'maintenance' && <Maintenance fleetData={fleetData} />}
          {activeTab === 'chat' && <AIChat />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Fleet Analytics Dashboard - Advanced Fleet Management System
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;