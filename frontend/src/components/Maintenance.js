import React, { useState, useEffect } from 'react';
import { fleetAPI } from '../api';

const MaintenanceCard = ({ vehicle, onPredict }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await fleetAPI.predictMaintenance(vehicle.vehicle_id);
      setPrediction(result);
      onPredict && onPredict(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilMaintenance = () => {
    const maintenanceDate = new Date(vehicle.next_maintenance);
    const today = new Date();
    const diffTime = maintenanceDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilMaintenance();
  const isUrgent = daysUntil <= 7;
  const isOverdue = daysUntil < 0;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      isOverdue ? 'border-red-500' : isUrgent ? 'border-yellow-500' : 'border-green-500'
    } transition-all duration-300 hover:shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{vehicle.vehicle_id}</h3>
          <p className="text-sm text-gray-600">{vehicle.type}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isOverdue 
            ? 'bg-red-100 text-red-800' 
            : isUrgent 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {isOverdue ? 'Overdue' : isUrgent ? 'Urgent' : 'Scheduled'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Next Maintenance:</span>
          <span className="font-medium">{vehicle.next_maintenance}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Days:</span>
          <span className={`font-medium ${
            isOverdue ? 'text-red-600' : isUrgent ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days`}
          </span>
        </div>
        {vehicle.mileage && (
          <div className="flex justify-between">
            <span className="text-gray-600">Mileage:</span>
            <span className="font-medium">{vehicle.mileage?.toLocaleString()} km</span>
          </div>
        )}
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {loading ? 'Analyzing...' : 'AI Prediction'}
      </button>

      {prediction && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">AI Analysis Result</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Maintenance Needed:</span>
              <span className={`font-medium ${
                prediction.needs_maintenance ? 'text-red-600' : 'text-green-600'
              }`}>
                {prediction.needs_maintenance ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Risk Probability:</span>
              <span className="font-medium">{(prediction.probability * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Recommended Date:</span>
              <span className="font-medium">{prediction.recommended_date}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MaintenanceSchedule = ({ alerts }) => {
  const sortedAlerts = alerts?.sort((a, b) => new Date(a.next_maintenance) - new Date(b.next_maintenance)) || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Maintenance Schedule</h3>
      
      {sortedAlerts.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-gray-500">No upcoming maintenance scheduled</span>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAlerts.map((alert, index) => {
            const daysUntil = Math.ceil((new Date(alert.next_maintenance) - new Date()) / (1000 * 60 * 60 * 24));
            const isUrgent = daysUntil <= 7;
            const isOverdue = daysUntil < 0;

            return (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    isOverdue ? 'bg-red-500' : isUrgent ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{alert.vehicle_id}</p>
                    <p className="text-sm text-gray-600">{alert.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{alert.next_maintenance}</p>
                  <p className={`text-xs ${
                    isOverdue ? 'text-red-600' : isUrgent ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MaintenanceStats = () => {
  const stats = [
    { label: 'Scheduled This Month', value: 15, color: 'blue' },
    { label: 'Completed This Month', value: 12, color: 'green' },
    { label: 'Overdue', value: 3, color: 'red' },
    { label: 'Average Cost', value: '$450', color: 'yellow' }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${colorClasses[stat.color]}`}>
            {stat.value}
          </div>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

const Maintenance = ({ fleetData }) => {
  const [predictions, setPredictions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const maintenanceAlerts = fleetData?.maintenanceAlerts || [];

  const handlePrediction = (prediction) => {
    setPredictions(prev => {
      const updated = prev.filter(p => p.vehicle_id !== prediction.vehicle_id);
      return [...updated, prediction];
    });
  };

  const filteredAlerts = maintenanceAlerts.filter(alert => {
    if (selectedFilter === 'all') return true;
    
    const daysUntil = Math.ceil((new Date(alert.next_maintenance) - new Date()) / (1000 * 60 * 60 * 24));
    
    switch (selectedFilter) {
      case 'urgent': return daysUntil <= 7 && daysUntil >= 0;
      case 'overdue': return daysUntil < 0;
      case 'scheduled': return daysUntil > 7;
      default: return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="text-gray-600">AI-powered maintenance scheduling and predictions</p>
        </div>
        <div className="flex space-x-2">
          {['all', 'urgent', 'overdue', 'scheduled'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <MaintenanceStats />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Cards */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Maintenance Status</h2>
            <p className="text-gray-600">Click "AI Prediction" for intelligent maintenance forecasting</p>
          </div>
          
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <span className="text-gray-500">No vehicles match the selected filter</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAlerts.map((alert, index) => (
                <MaintenanceCard
                  key={alert.vehicle_id || index}
                  vehicle={alert}
                  onPredict={handlePrediction}
                />
              ))}
            </div>
          )}
        </div>

        {/* Schedule Sidebar */}
        <div>
          <MaintenanceSchedule alerts={maintenanceAlerts} />
          
          {/* AI Insights */}
          {predictions.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights Summary</h3>
              <div className="space-y-3">
                {predictions.slice(-3).map((prediction, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-gray-900">{prediction.vehicle_id}</p>
                    <p className={`${prediction.needs_maintenance ? 'text-red-600' : 'text-green-600'}`}>
                      {prediction.needs_maintenance ? 'Maintenance recommended' : 'No immediate maintenance needed'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;