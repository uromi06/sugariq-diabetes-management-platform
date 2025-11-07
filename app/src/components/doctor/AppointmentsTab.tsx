import React, { useState } from 'react';
import type { Patient, Appointment, AppointmentTranscript } from '../../types';
import { getAppointmentsByPatientId, getUpcomingAppointments } from '../../data/mockAppointments';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock, Plus, FileText, X } from 'lucide-react';

interface AppointmentsTabProps {
  patient: Patient;
  transcripts: AppointmentTranscript[];
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ patient, transcripts }) => {
  const [centerMonth, setCenterMonth] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [expandedTranscript, setExpandedTranscript] = useState<string | null>(null);

  const appointments = getAppointmentsByPatientId(patient.id);
  const upcomingAppointments = getUpcomingAppointments(patient.id);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCenterMonth(new Date(centerMonth.getFullYear(), centerMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCenterMonth(new Date(centerMonth.getFullYear(), centerMonth.getMonth() + 1, 1));
  };

  const getAppointmentForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.find(apt => apt.date === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Generate 3 months
  const getThreeMonths = () => {
    const prevMonth = new Date(centerMonth.getFullYear(), centerMonth.getMonth() - 1, 1);
    const nextMonthDate = new Date(centerMonth.getFullYear(), centerMonth.getMonth() + 1, 1);
    return [prevMonth, centerMonth, nextMonthDate];
  };

  const renderMiniCalendar = (monthDate: Date) => {
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDay = getFirstDayOfMonth(monthDate);
    const days = [];

    // Empty cells for first week
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const appointment = getAppointmentForDate(date);
      const today = isToday(date);

      days.push(
        <div
          key={day}
          className={`
            h-8 flex items-center justify-center text-sm cursor-pointer rounded relative
            ${today ? 'bg-primary-100 font-bold text-primary-700' : 'hover:bg-gray-100'}
            ${appointment ? 'font-semibold' : 'text-gray-700'}
          `}
          onClick={() => appointment && setSelectedAppointment(appointment)}
        >
          {day}
          {appointment && (
            <div className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${getStatusColor(appointment.status)}`} />
          )}
        </div>
      );
    }

    return days;
  };

  const threeMonths = getThreeMonths();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-600 mt-1">
            Next appointment: {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'Not scheduled'}
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Schedule Appointment
        </button>
      </div>

      {/* 3-Month Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
            {threeMonths[0].toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {threeMonths[2].toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Three calendars side by side */}
        <div className="grid grid-cols-3 gap-6">
          {threeMonths.map((monthDate, idx) => (
            <div key={idx}>
              <h4 className="text-center font-semibold text-gray-900 mb-3">
                {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
              </h4>
              <div className="grid grid-cols-7 gap-1">
                {/* Day names */}
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 h-6 flex items-center justify-center">
                    {day}
                  </div>
                ))}
                {/* Calendar days */}
                {renderMiniCalendar(monthDate)}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-sm justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-100 border-2 border-primary-600 rounded"></div>
            <span className="text-gray-600">Today</span>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming appointments</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {upcomingAppointments.slice(0, 6).map(apt => (
              <div
                key={apt.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedAppointment(apt)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {apt.time} ({apt.duration} min)
                    </div>
                    {apt.notes && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{apt.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
              <button onClick={() => setSelectedAppointment(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedAppointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold text-gray-900">{selectedAppointment.time}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{selectedAppointment.duration} minutes</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedAppointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  selectedAppointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedAppointment.status}
                </span>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-gray-900">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button className="btn-secondary flex-1">
                  Reschedule
                </button>
                {selectedAppointment.status === 'scheduled' && (
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Previous Consultations (Transcripts) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary-600" />
          Previous Consultations
        </h3>

        {transcripts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No appointment transcripts available for this patient.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transcripts.map((transcript) => (
              <div key={transcript.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedTranscript(expandedTranscript === transcript.id ? null : transcript.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">
                        {new Date(transcript.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Duration: {transcript.duration} minutes
                      </p>
                    </div>
                  </div>
                  {expandedTranscript === transcript.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Accordion Content */}
                {expandedTranscript === transcript.id && (
                  <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                    {/* Summary */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">Summary</h5>
                      <p className="text-sm text-gray-700">{transcript.summary}</p>
                    </div>

                    {/* Full Transcript */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-semibold text-gray-900">Full Transcript</h5>
                      {transcript.fullTranscript.map((message, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            message.speaker === 'doctor'
                              ? 'bg-white border border-gray-200'
                              : 'bg-primary-50 border border-primary-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                  message.speaker === 'doctor'
                                    ? 'bg-gray-200 text-gray-700'
                                    : 'bg-primary-200 text-primary-700'
                                }`}
                              >
                                {message.speaker === 'doctor' ? 'Dr' : 'Pt'}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-gray-900">
                                  {message.speaker === 'doctor' ? 'Doctor' : patient.name}
                                </span>
                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700">{message.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsTab;
