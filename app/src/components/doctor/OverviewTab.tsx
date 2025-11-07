import React from 'react';
import type { Patient, HealthData } from '../../types';
import { Activity, Calendar, Pill, TrendingUp, AlertCircle, User, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface OverviewTabProps {
  patient: Patient;
  healthData?: HealthData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ patient, healthData }) => {
  const getComplianceStatus = (compliance: number) => {
    if (compliance >= 95) return { color: 'success', label: 'Excellent' };
    if (compliance >= 85) return { color: 'success', label: 'Good' };
    if (compliance >= 75) return { color: 'warning', label: 'Fair' };
    return { color: 'danger', label: 'Poor' };
  };

  const complianceStatus = getComplianceStatus(patient.medicationCompliance);

  return (
    <div className="space-y-6">
      {/* Patient Demographics */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium text-gray-900">{patient.name}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-medium text-gray-900">{patient.age} years old</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{patient.email}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{patient.phone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Diagnosis Date</p>
              <p className="font-medium text-gray-900">
                {format(new Date(patient.diagnosisDate), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Height / Weight</p>
              <p className="font-medium text-gray-900">
                {patient.height}" / {patient.weight} lbs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Latest A1C</p>
            <TrendingUp className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{patient.latestA1C}%</p>
          <p className="text-sm text-gray-600 mt-1">
            {patient.latestA1C < 7 ? 'Well controlled' : patient.latestA1C < 8 ? 'Fair control' : 'Needs attention'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg Glucose (30d)</p>
            <Activity className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{patient.averageGlucose}</p>
          <p className="text-sm text-gray-600 mt-1">mg/dL</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Last Appointment</p>
            <Calendar className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            {format(new Date(patient.lastAppointment), 'MMM d')}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {format(new Date(patient.lastAppointment), 'yyyy')}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Medication</p>
            <Pill className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{patient.medicationCompliance}%</p>
          <span className={`badge-${complianceStatus.color} mt-1`}>
            {complianceStatus.label}
          </span>
        </div>
      </div>

      {/* Recent Alerts */}
      {patient.recentAlerts && patient.recentAlerts.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-danger-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          </div>
          <div className="space-y-2">
            {patient.recentAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-danger-50 border border-danger-200 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 text-danger-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-danger-800">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Clinical Notes</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">Most Recent Visit</p>
              <p className="text-sm text-gray-600">
                {format(new Date(patient.lastAppointment), 'MMM d, yyyy')}
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Patient continues to show {patient.latestA1C < 7 ? 'excellent' : patient.latestA1C < 8 ? 'good' : 'moderate'} diabetes control.
              Medication compliance at {patient.medicationCompliance}%.
              {patient.nextAppointment
                ? ` Next follow-up scheduled for ${format(new Date(patient.nextAppointment), 'MMMM d, yyyy')}.`
                : ' Next follow-up to be scheduled.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
