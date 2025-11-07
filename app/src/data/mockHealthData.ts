import type { HealthData, GlucoseReading, A1CReading, WeightReading } from '../types';

// Generate realistic glucose readings for the past 90 days
const generateGlucoseReadings = (baseValue: number, variance: number, days: number = 90): GlucoseReading[] => {
  const readings: GlucoseReading[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate 3 readings per day (morning, afternoon, evening)
    const times = ['08:00', '13:00', '20:00'];
    times.forEach(time => {
      const randomVariance = (Math.random() - 0.5) * variance;
      const value = Math.round(baseValue + randomVariance);
      readings.push({
        date: date.toISOString().split('T')[0],
        time,
        value: Math.max(70, Math.min(300, value)), // Keep within realistic bounds
      });
    });
  }

  return readings;
};

// Generate A1C readings for the past 2 years (quarterly)
const generateA1CReadings = (currentA1C: number, trend: 'improving' | 'stable' | 'worsening'): A1CReading[] => {
  const readings: A1CReading[] = [];
  const today = new Date();

  for (let i = 7; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - (i * 3));

    let value = currentA1C;
    if (trend === 'improving') {
      value = currentA1C + (i * 0.2);
    } else if (trend === 'worsening') {
      value = currentA1C - (i * 0.15);
    } else {
      value = currentA1C + (Math.random() - 0.5) * 0.3;
    }

    readings.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 10) / 10,
    });
  }

  return readings.reverse();
};

// Generate weight readings for the past 6 months (weekly)
const generateWeightReadings = (currentWeight: number, trend: 'losing' | 'stable' | 'gaining'): WeightReading[] => {
  const readings: WeightReading[] = [];
  const today = new Date();
  const weeks = 26; // 6 months

  for (let i = weeks - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));

    let value = currentWeight;
    if (trend === 'losing') {
      value = currentWeight + (i * 0.3);
    } else if (trend === 'gaining') {
      value = currentWeight - (i * 0.2);
    } else {
      value = currentWeight + (Math.random() - 0.5) * 2;
    }

    readings.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 10) / 10,
    });
  }

  return readings.reverse();
};

export const mockHealthData: HealthData[] = [
  {
    patientId: '1', // Sarah Johnson
    glucoseReadings: generateGlucoseReadings(145, 40),
    a1cReadings: generateA1CReadings(7.2, 'stable'),
    weightReadings: generateWeightReadings(165, 'losing'),
  },
  {
    patientId: '2', // Michael Chen
    glucoseReadings: generateGlucoseReadings(132, 30),
    a1cReadings: generateA1CReadings(6.8, 'improving'),
    weightReadings: generateWeightReadings(180, 'stable'),
  },
  {
    patientId: '3', // Emily Rodriguez
    glucoseReadings: generateGlucoseReadings(168, 50),
    a1cReadings: generateA1CReadings(8.1, 'worsening'),
    weightReadings: generateWeightReadings(142, 'stable'),
  },
  {
    patientId: '4', // Robert Thompson
    glucoseReadings: generateGlucoseReadings(152, 45),
    a1cReadings: generateA1CReadings(7.5, 'stable'),
    weightReadings: generateWeightReadings(195, 'losing'),
  },
  {
    patientId: '5', // Jennifer Park
    glucoseReadings: generateGlucoseReadings(125, 25),
    a1cReadings: generateA1CReadings(6.5, 'improving'),
    weightReadings: generateWeightReadings(155, 'stable'),
  },
];

// Helper function to get health data by patient ID
export const getHealthDataByPatientId = (patientId: string): HealthData | undefined => {
  return mockHealthData.find(data => data.patientId === patientId);
};

// Helper function to get recent glucose readings (last N days)
export const getRecentGlucoseReadings = (patientId: string, days: number = 30): GlucoseReading[] => {
  const healthData = getHealthDataByPatientId(patientId);
  if (!healthData) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return healthData.glucoseReadings.filter(reading =>
    new Date(reading.date) >= cutoffDate
  );
};
