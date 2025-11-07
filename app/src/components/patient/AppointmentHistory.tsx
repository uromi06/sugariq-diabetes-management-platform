import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUpcomingAppointments, getPastAppointments } from '../../data/mockAppointments';
import { Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AppointmentHistory: React.FC = () => {
  const { user } = useAuth();
  const upcomingAppointments = user ? getUpcomingAppointments(user.id) : [];
  const pastAppointments = user ? getPastAppointments(user.id).slice(0, 5) : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600 mt-1">View your upcoming and past appointments</p>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming</h2>
        {upcomingAppointments.length === 0 ? (
          <div className="card">
            <p className="text-gray-500">No upcoming appointments scheduled.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="card border-2 border-primary-200 bg-primary-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary-600 rounded-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <span>•</span>
                        <span>{appointment.duration} minutes</span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Past Appointments</h2>
        {pastAppointments.length === 0 ? (
          <div className="card">
            <p className="text-gray-500">No past appointments on record.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastAppointments.map((appointment) => (
              <div key={appointment.id} className="card">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {format(parseISO(appointment.date), 'MMMM d, yyyy')}
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                      <span>{appointment.time}</span>
                      <span>•</span>
                      <span>{appointment.duration} min</span>
                      {appointment.notes && (
                        <>
                          <span>•</span>
                          <span>{appointment.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;
