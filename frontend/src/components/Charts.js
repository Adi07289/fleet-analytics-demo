import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Charts = ({ fuelTrends }) => {
  // Prepare data for charts
  const fuelData = fuelTrends?.labels?.map((label, index) => ({
    day: label,
    fuel_usage: fuelTrends.fuel_usage?.[index] || 0,
    efficiency: fuelTrends.efficiency?.[index] || 0
  })) || [];

  // Sample data for additional charts
  const vehicleTypeData = [
    { name: 'Trucks', value: 45, color: '#3b82f6' },
    { name: 'Vans', value: 30, color: '#10b981' },
    { name: 'Cars', value: 20, color: '#f59e0b' },
    { name: 'Buses', value: 5, color: '#ef4444' }
  ];

  const weeklyPerformance = [
    { week: 'Week 1', distance: 3200, fuel: 580, efficiency: 27.2 },
    { week: 'Week 2', distance: 3450, fuel: 620, efficiency: 28.1 },
    { week: 'Week 3', distance: 3100, fuel: 555, efficiency: 28.8 },
    { week: 'Week 4', distance: 3600, fuel: 645, efficiency: 29.1 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Fuel Trends Chart */}
      <div className="chart-container animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Fuel Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={fuelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="fuel_usage"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              name="Fuel Usage (L)"
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
              name="Efficiency (MPG)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Fleet Composition Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fleet Composition
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={vehicleTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {vehicleTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Performance Bar Chart */}
        <div className="chart-container animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="week" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="efficiency" 
                fill="#3b82f6" 
                name="Efficiency (MPG)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distance vs Fuel Consumption */}
      <div className="chart-container animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Distance vs Fuel Consumption
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="week" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="distance" 
              fill="#3b82f6" 
              name="Distance (km)"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="fuel" 
              fill="#10b981" 
              name="Fuel (L)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;