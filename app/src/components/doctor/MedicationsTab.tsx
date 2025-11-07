import React, { useState } from 'react';
import type { Patient, Medication } from '../../types';
import { getMedicationsByPatientId } from '../../data/mockMedications';
import { Pill, Plus, Calendar, User, AlertCircle } from 'lucide-react';

interface MedicationsTabProps {
  patient: Patient;
}

const MedicationsTab: React.FC<MedicationsTabProps> = ({ patient }) => {
  const medications = getMedicationsByPatientId(patient.id);
  const [showAddMedication, setShowAddMedication] = useState(false);

  const activeMedications = medications.filter(med => med.status === 'active');
  const inactiveMedications = medications.filter(med => med.status !== 'active');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medications</h2>
          <p className="text-gray-600 mt-1">
            Current medication compliance: {patient.medicationCompliance}%
          </p>
        </div>
        <button
          onClick={() => setShowAddMedication(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Medication
        </button>
      </div>

      {/* Compliance Warning */}
      {patient.medicationCompliance < 80 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Low Medication Compliance</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Patient's medication compliance is at {patient.medicationCompliance}%. Consider
              discussing adherence strategies during next appointment.
            </p>
          </div>
        </div>
      )}

      {/* Active Medications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Pill className="h-5 w-5 mr-2 text-primary-600" />
          Active Medications ({activeMedications.length})
        </h3>

        {activeMedications.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No active medications</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeMedications.map((medication) => (
              <div
                key={medication.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {medication.name}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(medication.status)}`}>
                        {medication.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Dosage</p>
                        <p className="text-gray-900 font-medium">{medication.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Frequency</p>
                        <p className="text-gray-900 font-medium">{medication.frequency}</p>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="text-gray-900">{new Date(medication.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Prescribed By</p>
                          <p className="text-gray-900">{medication.prescribedBy}</p>
                        </div>
                      </div>
                    </div>

                    {medication.instructions && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Instructions</p>
                        <p className="text-gray-900">{medication.instructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Medications */}
      {inactiveMedications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Previous Medications ({inactiveMedications.length})
          </h3>
          <div className="space-y-3">
            {inactiveMedications.map((medication) => (
              <div
                key={medication.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-700">{medication.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(medication.status)}`}>
                        {medication.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {medication.dosage} - {medication.frequency}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(medication.startDate).toLocaleDateString()}
                      {medication.endDate && ` - ${new Date(medication.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Medication Modal (placeholder) */}
      {showAddMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add New Medication</h3>
            <p className="text-gray-600 mb-4">
              Medication management interface coming soon...
            </p>
            <button
              onClick={() => setShowAddMedication(false)}
              className="btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationsTab;
