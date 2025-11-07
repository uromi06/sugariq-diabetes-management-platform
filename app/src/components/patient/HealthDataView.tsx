import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPatientById } from '../../data/mockPatients';
import { getHealthDataByPatientId } from '../../data/mockHealthData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Scale } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const HealthDataView: React.FC = () => {
  const { user } = useAuth();
  const patient = user ? getPatientById(user.id) : null;
  const healthData = user ? getHealthDataByPatientId(user.id) : null;

  if (!patient || !healthData) {
    return (
      <div className="card">
        <p className="text-gray-500">Unable to load health data.</p>
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

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { label: 'Low', color: 'danger', message: 'Your blood sugar is low. Have a snack if needed.' };
    if (value <= 140) return { label: 'Normal', color: 'success', message: 'Your blood sugar is in a healthy range.' };
    if (value <= 180) return { label: 'Slightly High', color: 'warning', message: 'Your blood sugar is a bit high. Stay hydrated.' };
    return { label: 'High', color: 'danger', message: 'Your blood sugar is high. Monitor closely and contact your doctor if it persists.' };
  };

  const latestGlucose = healthData.glucoseReadings[healthData.glucoseReadings.length - 1];
  const glucoseStatus = getGlucoseStatus(latestGlucose.value);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Health Data</h1>
        <p className="text-gray-600 mt-1">Track your diabetes management progress</p>
      </div>

      {/* Current Readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Latest Glucose</p>
            <Activity className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{latestGlucose.value}</p>
          <div className="mt-2">
            <span className={`badge-${glucoseStatus.color}`}>{glucoseStatus.label}</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {latestGlucose.time} on {format(parseISO(latestGlucose.date), 'MMM d')}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Current A1C</p>
            <TrendingUp className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{patient.latestA1C}%</p>
          <div className="mt-2">
            <span className={patient.latestA1C < 7 ? 'badge-success' : patient.latestA1C < 8 ? 'badge-warning' : 'badge-danger'}>
              {patient.latestA1C < 7 ? 'Excellent' : patient.latestA1C < 8 ? 'Good' : 'Needs Work'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2">Target: Below 7%</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Current Weight</p>
            <Scale className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{patient.weight}</p>
          <p className="text-sm text-gray-600 mt-1">lbs</p>
          <p className="text-xs text-gray-600 mt-2">Height: {patient.height}"</p>
        </div>
      </div>

      {/* Understanding Your Numbers */}
      <div className="card bg-blue-50 border-2 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Understanding Your Latest Glucose Reading</h2>
        <p className="text-sm text-gray-700 mb-3">
          <strong>Your reading: {latestGlucose.value} mg/dL</strong> - {glucoseStatus.message}
        </p>
        <div className="bg-white rounded-lg p-4 border border-blue-300">
          <p className="text-sm font-semibold text-gray-900 mb-2">Healthy Blood Sugar Ranges:</p>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• <strong>Before meals:</strong> 80-130 mg/dL</li>
            <li>• <strong>2 hours after meals:</strong> Less than 180 mg/dL</li>
            <li>• <strong>Bedtime:</strong> 90-150 mg/dL</li>
          </ul>
        </div>
      </div>

      {/* Blood Glucose Trend */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Blood Glucose Trend (Last 30 Days)</h2>
        <p className="text-sm text-gray-600 mb-4">
          This chart shows your average daily blood sugar levels. Keeping your levels steady helps prevent complications.
        </p>
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
      </div>

      {/* A1C History */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">A1C History</h2>
        <p className="text-sm text-gray-600 mb-4">
          A1C measures your average blood sugar over 2-3 months. Lower values indicate better diabetes control.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={a1cChartData}>
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
            <Bar dataKey="value" fill="#22c55e" name="A1C %" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Goal:</strong> Most people with diabetes should aim for an A1C below 7%. Your doctor may set a
            different target based on your individual needs.
          </p>
        </div>
      </div>

      {/* Tips Section */}
      <div className="card bg-primary-50 border-2 border-primary-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Tips for Better Blood Sugar Control</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Check your blood sugar regularly and record the results</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Take your diabetes medications exactly as prescribed</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Eat balanced meals at regular times throughout the day</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Stay physically active most days of the week</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Manage stress through relaxation techniques or hobbies</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HealthDataView;
