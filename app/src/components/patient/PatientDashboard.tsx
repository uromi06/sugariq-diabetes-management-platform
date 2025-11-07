import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPatientById } from '../../data/mockPatients';
import { getHealthDataByPatientId, getRecentGlucoseReadings } from '../../data/mockHealthData';
import { getTranscriptsByPatientId } from '../../data/mockTranscripts';
import { Activity, Calendar, Pill, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const patient = user ? getPatientById(user.id) : null;
  const healthData = user ? getHealthDataByPatientId(user.id) : null;
  const recentGlucose = user ? getRecentGlucoseReadings(user.id, 7) : [];
  const transcripts = user ? getTranscriptsByPatientId(user.id) : [];

  if (!patient) {
    return (
      <div className="card">
        <p className="text-gray-500">Unable to load patient data.</p>
      </div>
    );
  }

  const latestTranscript = transcripts.length > 0 ? transcripts[transcripts.length - 1] : null;

  // Calculate average glucose from last 7 days
  const avgRecentGlucose =
    recentGlucose.length > 0
      ? Math.round(recentGlucose.reduce((sum, reading) => sum + reading.value, 0) / recentGlucose.length)
      : patient.averageGlucose;

  const getA1CMessage = (a1c: number) => {
    if (a1c < 7)
      return {
        message: 'Your blood sugar control is excellent! Keep up the great work.',
        color: 'success',
      };
    if (a1c < 8)
      return {
        message: 'Your blood sugar control is good, but there\'s room for improvement.',
        color: 'warning',
      };
    return {
      message: 'Your blood sugar needs more attention. Please follow up with your doctor.',
      color: 'danger',
    };
  };

  const a1cMessage = getA1CMessage(patient.latestA1C);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {patient.name.split(' ')[0]}!</h1>
        <p className="text-primary-100">Here's your diabetes management overview.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Latest A1C</p>
            <TrendingUp className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{patient.latestA1C}%</p>
          <div className="mt-2">
            <span className={`badge-${a1cMessage.color}`}>
              {patient.latestA1C < 7 ? 'Excellent' : patient.latestA1C < 8 ? 'Good' : 'Needs Work'}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Recent Glucose</p>
            <Activity className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgRecentGlucose}</p>
          <p className="text-sm text-gray-600 mt-1">mg/dL (7 day avg)</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Last Check-up</p>
            <Calendar className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-lg font-bold text-gray-900">{format(parseISO(patient.lastAppointment), 'MMM d')}</p>
          <p className="text-sm text-gray-600 mt-1">{format(parseISO(patient.lastAppointment), 'yyyy')}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Medication</p>
            <Pill className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{patient.medicationCompliance}%</p>
          <p className="text-sm text-gray-600 mt-1">On track</p>
        </div>
      </div>

      {/* A1C Explanation */}
      <div className={`card border-2 border-${a1cMessage.color}-200 bg-${a1cMessage.color}-50`}>
        <div className="flex items-start space-x-3">
          {a1cMessage.color === 'success' ? (
            <CheckCircle className="h-6 w-6 text-success-600 flex-shrink-0 mt-1" />
          ) : (
            <AlertCircle className="h-6 w-6 text-warning-600 flex-shrink-0 mt-1" />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">About Your A1C</h3>
            <p className="text-sm text-gray-700">{a1cMessage.message}</p>
            <p className="text-sm text-gray-700 mt-2">
              Your A1C measures your average blood sugar over the past 2-3 months. A target below 7% is generally
              recommended for most people with diabetes.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Appointment */}
      {patient.nextAppointment && (
        <div className="card border-2 border-primary-200 bg-primary-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Calendar className="h-6 w-6 text-primary-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Upcoming Appointment</h3>
                <p className="text-sm text-gray-700">
                  You have an appointment scheduled for{' '}
                  <span className="font-semibold">{format(parseISO(patient.nextAppointment), 'MMMM d, yyyy')}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Make sure to check your blood sugar regularly before your visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Appointment Summary */}
      {latestTranscript && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Appointment Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(parseISO(latestTranscript.date), 'MMMM d, yyyy')}</span>
              <span className="mx-2">•</span>
              <span>{latestTranscript.duration} minutes</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{latestTranscript.summary}</p>
          </div>
        </div>
      )}

      {/* Health Tips */}
      <div className="card bg-blue-50 border-2 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Health Tips</h2>
        <ul className="space-y-2">
          <li className="flex items-start text-sm text-gray-700">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <span>Check your blood sugar at the same times each day for consistent tracking</span>
          </li>
          <li className="flex items-start text-sm text-gray-700">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <span>Stay active with at least 30 minutes of physical activity most days</span>
          </li>
          <li className="flex items-start text-sm text-gray-700">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <span>Take your medications at the same time each day</span>
          </li>
          <li className="flex items-start text-sm text-gray-700">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <span>Eat regular, balanced meals to help manage blood sugar levels</span>
          </li>
        </ul>
      </div>

      {/* Alerts */}
      {patient.recentAlerts && patient.recentAlerts.length > 0 && (
        <div className="card border-2 border-danger-200 bg-danger-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-danger-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Important Alerts</h3>
              <ul className="space-y-1">
                {patient.recentAlerts.map((alert, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    • {alert}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-700 mt-2">
                Please contact your healthcare provider if you have any concerns.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
