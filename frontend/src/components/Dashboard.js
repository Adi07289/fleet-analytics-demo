import React, { useState, useEffect } from 'react';
import Charts from './Charts';
import { fleetAPI } from '../api';

const MetricCard = ({ title, value, change, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50'
  };

  return (
    <div className="metric-card animate-fade-in">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last month
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const VehicleTable = ({ vehicles }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'maintenance': return 'status-maintenance';
      case 'inactive': return 'status-inactive';
      default: return 'status-active';
    }
  };

  return (
    <div className="chart-container animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Overview</h3>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuel Efficiency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Maintenance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles?.slice(0, 8).map((vehicle, index) => (
              <tr key={vehicle.vehicle_id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vehicle.vehicle_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusClass(vehicle.status)}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vehicle.fuel_efficiency} MPG
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.next_maintenance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AlertsPanel = ({ alerts }) => {
  return (
    <div className="chart-container animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
      <div className="space-y-3">
        {alerts?.slice(0, 5).map((alert, index) => (
          <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex-shrink-0">
              <span className="text-yellow-600">⚠️</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-yellow-800">
                {alert.vehicle_id} - Maintenance Due
              </p>
              <p className="text-xs text-yellow-600">
                Due: {alert.next_maintenance} | Mileage: {alert.mileage?.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {(!alerts || alerts.length === 0) && (
          <div className="text-center py-4">
            <span className="text-gray-500">No alerts at this time</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ fleetData }) => {
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const data = await fleetAPI.getPerformanceMetrics();
        setPerformanceData(data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();
  }, []);

  const summary = fleetData?.summary || {};
  const vehicles = fleetData?.vehicles || [];
  const fuelTrends = fleetData?.fuelTrends || {};
  const maintenanceAlerts = fleetData?.maintenanceAlerts || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Dashboard</h1>
          <p className="text-gray-600">Real-time insights into your fleet performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Vehicles"
          value={summary.total_vehicles || 0}
          icon="🚛"
          color="blue"
        />
        <MetricCard
          title="Active Vehicles"
          value={summary.active_vehicles || 0}
          change="+5.2%"
          icon="✅"
          color="green"
        />
        <MetricCard
          title="Avg Fuel Efficiency"
          value={`${summary.fuel_efficiency || 0} MPG`}
          change="+12%"
          icon="⛽"
          color="blue"
        />
        <MetricCard
          title="Maintenance Due"
          value={summary.maintenance_due || 0}
          icon="🔧"
          color="yellow"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Charts fuelTrends={fuelTrends} />
        <AlertsPanel alerts={maintenanceAlerts} />
      </div>

      {/* Performance Metrics */}
      {performanceData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance Covered</span>
                <span className="font-semibold">{performanceData.weekly_stats.distance_covered?.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Consumed</span>
                <span className="font-semibold">{performanceData.weekly_stats.fuel_consumed?.toLocaleString()} L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Speed</span>
                <span className="font-semibold">{performanceData.weekly_stats.average_speed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Idle Time</span>
                <span className="font-semibold">{performanceData.weekly_stats.idle_time}%</span>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {performanceData.top_performers?.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{performer.vehicle_id}</p>
                    <p className="text-sm text-gray-500">{performer.efficiency} MPG</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {performer.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Critical</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {performanceData.alerts?.critical || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Warning</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {performanceData.alerts?.warning || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Info</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {performanceData.alerts?.info || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Table */}
      <VehicleTable vehicles={vehicles} />
    </div>
  );
};

export default Dashboard;