import React, { useState } from 'react';
import type { Patient, HealthData } from '../../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table2, BarChart3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface HealthDataTabProps {
  patient: Patient;
  healthData?: HealthData;
}

type ViewMode = 'chart' | 'table';

const HealthDataTab: React.FC<HealthDataTabProps> = ({ patient, healthData }) => {
  const [glucoseViewMode, setGlucoseViewMode] = useState<ViewMode>('chart');
  const [a1cViewMode, setA1cViewMode] = useState<ViewMode>('chart');
  const [weightViewMode, setWeightViewMode] = useState<ViewMode>('chart');

  if (!healthData) {
    return (
      <div className="card">
        <p className="text-gray-500">No health data available for this patient.</p>
      </div>
    );
  }

  // Prepare glucose data for chart (last 30 days, daily averages)
  const glucoseChartData = healthData.glucoseReadings
    .filter((_, index, array) => index >= array.length - 90) // Last 90 readings (30 days × 3 per day)
    .reduce((acc: any[], reading) => {
      const existingDay = acc.find(d => d.date === reading.date);
      if (existingDay) {
        existingDay.total += reading.value;
        existingDay.count += 1;
        existingDay.value = Math.round(existingDay.total / existingDay.count);
      } else {
        acc.push({ date: reading.date, value: reading.value, total: reading.value, count: 1 });
      }
      return acc;
    }, [])
    .map(({ date, value }) => ({ date, value }));

  // A1C chart data
  const a1cChartData = healthData.a1cReadings.map(reading => ({
    date: format(parseISO(reading.date), 'MMM yyyy'),
    value: reading.value,
  }));

  // Weight chart data
  const weightChartData = healthData.weightReadings.map(reading => ({
    date: format(parseISO(reading.date), 'MMM d'),
    value: reading.value,
  }));

  const ViewToggle: React.FC<{ mode: ViewMode; setMode: (mode: ViewMode) => void }> = ({ mode, setMode }) => (
    <div className="flex space-x-2">
      <button
        onClick={() => setMode('chart')}
        className={`p-2 rounded-lg transition-colors ${
          mode === 'chart' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <BarChart3 className="h-5 w-5" />
      </button>
      <button
        onClick={() => setMode('table')}
        className={`p-2 rounded-lg transition-colors ${
          mode === 'table' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Table2 className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Blood Glucose Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Blood Glucose Levels</h2>
            <p className="text-sm text-gray-600">Daily averages over the last 30 days</p>
          </div>
          <ViewToggle mode={glucoseViewMode} setMode={setGlucoseViewMode} />
        </div>

        {glucoseViewMode === 'chart' ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={glucoseChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => format(parseISO(value), 'MMM d')}
              />
              <YAxis
                domain={[60, 220]}
                tick={{ fontSize: 12 }}
                label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelFormatter={(value) => format(parseISO(value as string), 'MMM d, yyyy')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', r: 3 }}
                name="Glucose (mg/dL)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value (mg/dL)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthData.glucoseReadings.slice(-20).reverse().map((reading, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {format(parseISO(reading.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{reading.time || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{reading.value}</td>
                    <td className="px-4 py-3 text-sm">
                      {reading.value < 70 ? (
                        <span className="badge-danger">Low</span>
                      ) : reading.value > 180 ? (
                        <span className="badge-warning">High</span>
                      ) : (
                        <span className="badge-success">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* A1C Trend Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">A1C Trend</h2>
            <p className="text-sm text-gray-600">Quarterly measurements over the last 2 years</p>
          </div>
          <ViewToggle mode={a1cViewMode} setMode={setA1cViewMode} />
        </div>

        {a1cViewMode === 'chart' ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={a1cChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[5, 10]}
                tick={{ fontSize: 12 }}
                label={{ value: 'A1C %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                name="A1C %"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">A1C %</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Control</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthData.a1cReadings.slice().reverse().map((reading, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {format(parseISO(reading.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{reading.value}%</td>
                    <td className="px-4 py-3 text-sm">
                      {reading.value < 7 ? (
                        <span className="badge-success">Good</span>
                      ) : reading.value < 8 ? (
                        <span className="badge-warning">Fair</span>
                      ) : (
                        <span className="badge-danger">High</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Weight Tracking Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Weight Tracking</h2>
            <p className="text-sm text-gray-600">Weekly measurements over the last 6 months</p>
          </div>
          <ViewToggle mode={weightViewMode} setMode={setWeightViewMode} />
        </div>

        {weightViewMode === 'chart' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weightChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: 'lbs', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="value" fill="#f59e0b" name="Weight (lbs)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight (lbs)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthData.weightReadings.slice().reverse().map((reading, index, array) => {
                  const previousReading = array[index + 1];
                  const change = previousReading ? reading.value - previousReading.value : 0;

                  return (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {format(parseISO(reading.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{reading.value}</td>
                      <td className="px-4 py-3 text-sm">
                        {index < array.length - 1 && (
                          <span className={change > 0 ? 'text-danger-600' : change < 0 ? 'text-success-600' : 'text-gray-600'}>
                            {change > 0 ? '+' : ''}{change.toFixed(1)} lbs
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthDataTab;
