import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTranscriptsByPatientId } from '../../data/mockTranscripts';
import { Calendar, Clock, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AppointmentHistory: React.FC = () => {
  const { user } = useAuth();
  const transcripts = user ? getTranscriptsByPatientId(user.id) : [];

  if (transcripts.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Appointment History</h1>
          <p className="text-gray-600 mt-1">View summaries of your past appointments</p>
        </div>
        <div className="card">
          <p className="text-gray-500">No appointment history available.</p>
        </div>
      </div>
    );
  }

  // Convert medical jargon to plain language
  const simplifyText = (text: string): string => {
    return text
      .replace(/A1C/g, 'blood sugar average')
      .replace(/glucose control/g, 'blood sugar management')
      .replace(/medication compliance/g, 'taking medications as prescribed')
      .replace(/basal insulin/g, 'long-acting insulin')
      .replace(/medication regimen/g, 'medication schedule');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Appointment History</h1>
        <p className="text-gray-600 mt-1">
          {transcripts.length} appointment{transcripts.length !== 1 ? 's' : ''} on record
        </p>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {transcripts
          .slice()
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((transcript) => (
            <div key={transcript.id} className="card">
              {/* Appointment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {format(parseISO(transcript.date), 'MMMM d, yyyy')}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{transcript.duration} minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-900">Visit Summary</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed ml-7">
                  {simplifyText(transcript.summary)}
                </p>
              </div>

              {/* Key Points (extracted from transcript) */}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">What We Discussed</h4>
                <ul className="space-y-2">
                  {transcript.fullTranscript
                    .filter(msg => msg.speaker === 'doctor' && msg.message.length > 50)
                    .slice(0, 3)
                    .map((msg, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <span className="mr-2 text-primary-600">•</span>
                        <span>{simplifyText(msg.message)}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Next Steps (if available) */}
              {transcript.summary.includes('continue') || transcript.summary.includes('adjust') ? (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Follow-Up Actions</h4>
                  <p className="text-sm text-gray-700">
                    Continue with your current diabetes management plan. Keep checking your blood sugar regularly
                    and take your medications as prescribed. Contact your doctor if you have any concerns.
                  </p>
                </div>
              ) : null}
            </div>
          ))}
      </div>

      {/* Help Section */}
      <div className="card bg-green-50 border-2 border-green-200">
        <h3 className="font-semibold text-gray-900 mb-2">Questions About Your Appointments?</h3>
        <p className="text-sm text-gray-700 mb-3">
          If you need clarification about anything discussed in your appointments or have questions about your
          diabetes management, please don't hesitate to contact your healthcare team.
        </p>
        <button className="btn-primary">Contact Your Doctor</button>
      </div>
    </div>
  );
};

export default AppointmentHistory;
