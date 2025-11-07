import type { Patient } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 45,
    diagnosisDate: '2019-03-15',
    lastAppointment: '2025-10-20',
    nextAppointment: '2025-12-15',
    latestA1C: 7.2,
    averageGlucose: 145,
    medicationCompliance: 92,
    recentAlerts: ['Glucose spike detected on Nov 3', 'Missed morning medication on Nov 1'],
    weight: 165,
    height: 65,
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 58,
    diagnosisDate: '2015-08-22',
    lastAppointment: '2025-10-28',
    nextAppointment: '2026-01-20',
    latestA1C: 6.8,
    averageGlucose: 132,
    medicationCompliance: 96,
    recentAlerts: [],
    weight: 180,
    height: 70,
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 32,
    diagnosisDate: '2021-11-10',
    lastAppointment: '2025-11-01',
    latestA1C: 8.1,
    averageGlucose: 168,
    medicationCompliance: 78,
    recentAlerts: ['A1C trending upward', 'Low compliance this week', 'Emergency room visit on Oct 25'],
    weight: 142,
    height: 63,
    email: 'emily.rodriguez@email.com',
    phone: '(555) 345-6789',
  },
  {
    id: '4',
    name: 'Robert Thompson',
    age: 67,
    diagnosisDate: '2012-05-18',
    lastAppointment: '2025-10-15',
    nextAppointment: '2025-11-22',
    latestA1C: 7.5,
    averageGlucose: 152,
    medicationCompliance: 88,
    recentAlerts: ['Adjust insulin dosage recommended'],
    weight: 195,
    height: 72,
    email: 'robert.thompson@email.com',
    phone: '(555) 456-7890',
  },
  {
    id: '5',
    name: 'Jennifer Park',
    age: 41,
    diagnosisDate: '2018-02-28',
    lastAppointment: '2025-11-05',
    nextAppointment: '2026-02-10',
    latestA1C: 6.5,
    averageGlucose: 125,
    medicationCompliance: 98,
    recentAlerts: [],
    weight: 155,
    height: 66,
    email: 'jennifer.park@email.com',
    phone: '(555) 567-8901',
  },
];

// Helper function to get patient by ID
export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

// Helper function to get patient name by ID
export const getPatientName = (id: string): string => {
  const patient = getPatientById(id);
  return patient ? patient.name : 'Unknown Patient';
};
