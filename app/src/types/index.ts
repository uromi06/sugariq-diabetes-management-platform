export type UserRole = 'doctor' | 'patient';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosisDate: string;
  lastAppointment: string;
  nextAppointment?: string;
  latestA1C: number;
  averageGlucose: number;
  medicationCompliance: number;
  recentAlerts?: string[];
  weight: number;
  height: number;
  email: string;
  phone: string;
}

export interface GlucoseReading {
  date: string;
  value: number;
  time?: string;
}

export interface A1CReading {
  date: string;
  value: number;
}

export interface WeightReading {
  date: string;
  value: number;
}

export interface HealthData {
  patientId: string;
  glucoseReadings: GlucoseReading[];
  a1cReadings: A1CReading[];
  weightReadings: WeightReading[];
}

export interface AppointmentTranscript {
  id: string;
  patientId: string;
  date: string;
  duration: number; // in minutes
  summary: string;
  fullTranscript: TranscriptMessage[];
}

export interface TranscriptMessage {
  timestamp: string;
  speaker: 'doctor' | 'patient';
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}
