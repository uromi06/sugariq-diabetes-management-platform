export interface AIResponse {
  keywords: string[];
  response: string;
}

export const aiResponses: AIResponse[] = [
  {
    keywords: ['a1c', 'trend', 'hemoglobin'],
    response: 'Based on the patient\'s historical data, their A1C has shown {trend} over the past 8 quarters. Their current A1C of {current}% is {status}. The trend suggests {recommendation}.',
  },
  {
    keywords: ['glucose', 'pattern', 'blood sugar', 'levels'],
    response: 'Analyzing the glucose patterns over the last 90 days, I\'ve observed that the patient\'s average glucose is {avg} mg/dL. Peak values typically occur {peak_time}, and the lowest readings are generally seen {low_time}. There have been {spike_count} significant spikes above 200 mg/dL.',
  },
  {
    keywords: ['medication', 'compliance', 'adherence'],
    response: 'The patient\'s medication compliance rate is {compliance}%. This is considered {rating}. {recommendation}',
  },
  {
    keywords: ['last appointment', 'recent visit', 'last visit'],
    response: 'The patient\'s last appointment was on {date}. During this visit, we discussed {topics}. The key takeaways were: {summary}',
  },
  {
    keywords: ['weight', 'bmi'],
    response: 'The patient\'s current weight is {weight} lbs (height: {height} inches). Over the past 6 months, their weight has {trend}. This {impact} their diabetes management.',
  },
  {
    keywords: ['alert', 'warning', 'concern'],
    response: 'Recent alerts for this patient include: {alerts}. {recommendation}',
  },
  {
    keywords: ['recommend', 'suggestion', 'advice'],
    response: 'Based on the comprehensive data analysis, I would recommend: {recommendations}',
  },
];

export const getAIResponse = (query: string, patientId: string, patientData: any): string => {
  const lowerQuery = query.toLowerCase();

  // A1C trend response
  if (lowerQuery.includes('a1c') || lowerQuery.includes('trend')) {
    const a1cReadings = patientData.healthData?.a1cReadings || [];
    if (a1cReadings.length >= 2) {
      const current = a1cReadings[a1cReadings.length - 1].value;
      const previous = a1cReadings[a1cReadings.length - 2].value;
      const trend = current < previous ? 'improvement' : current > previous ? 'an upward trajectory' : 'stability';
      const status = current < 7 ? 'well-controlled' : current < 8 ? 'moderately controlled' : 'requiring attention';
      const recommendation = current < 7
        ? 'continued adherence to the current treatment plan'
        : 'considering adjustments to medication or lifestyle interventions';

      return `Based on the patient's historical data, their A1C has shown ${trend} over the past 8 quarters. Their current A1C of ${current}% is ${status}. The trend suggests ${recommendation}.`;
    }
  }

  // Glucose pattern response
  if (lowerQuery.includes('glucose') || lowerQuery.includes('blood sugar') || lowerQuery.includes('pattern')) {
    const avgGlucose = patientData.patient?.averageGlucose || 0;
    const rating = avgGlucose < 140 ? 'excellent' : avgGlucose < 160 ? 'good' : avgGlucose < 180 ? 'fair' : 'needs improvement';

    return `Analyzing the glucose patterns over the last 90 days, I've observed that the patient's average glucose is ${avgGlucose} mg/dL, which is ${rating}. Peak values typically occur in the late afternoon (13:00-15:00), and the lowest readings are generally seen in the morning before breakfast. The patient should continue monitoring regularly and maintain consistent meal timing.`;
  }

  // Medication compliance
  if (lowerQuery.includes('medication') || lowerQuery.includes('compliance') || lowerQuery.includes('adherence')) {
    const compliance = patientData.patient?.medicationCompliance || 0;
    const rating = compliance >= 95 ? 'excellent' : compliance >= 85 ? 'good' : compliance >= 75 ? 'fair' : 'concerning';
    const recommendation =
      compliance >= 95
        ? 'The patient is doing an outstanding job maintaining their medication schedule.'
        : compliance >= 85
        ? 'Consider discussing any barriers to medication adherence to improve consistency.'
        : 'It would be beneficial to explore challenges the patient faces with medication timing and develop strategies to improve adherence.';

    return `The patient's medication compliance rate is ${compliance}%. This is considered ${rating}. ${recommendation}`;
  }

  // Last appointment
  if (lowerQuery.includes('appointment') || lowerQuery.includes('visit')) {
    const lastAppointment = patientData.patient?.lastAppointment || 'unknown';
    return `The patient's last appointment was on ${lastAppointment}. During this visit, we discussed their glucose management, medication adherence, and lifestyle factors. The patient has been making good progress with dietary changes and regular physical activity.`;
  }

  // Weight/BMI
  if (lowerQuery.includes('weight') || lowerQuery.includes('bmi')) {
    const weight = patientData.patient?.weight || 0;
    const height = patientData.patient?.height || 0;
    return `The patient's current weight is ${weight} lbs (height: ${height} inches). Over the past 6 months, their weight has been relatively stable with minor fluctuations. Maintaining a healthy weight positively impacts their diabetes management and insulin sensitivity.`;
  }

  // Alerts
  if (lowerQuery.includes('alert') || lowerQuery.includes('warning') || lowerQuery.includes('concern')) {
    const alerts = patientData.patient?.recentAlerts || [];
    if (alerts.length > 0) {
      return `Recent alerts for this patient include: ${alerts.join('; ')}. These should be addressed during the next appointment to ensure optimal diabetes management.`;
    }
    return 'There are no recent alerts for this patient. Their diabetes management appears to be stable and well-controlled.';
  }

  // Default response
  return `I can help you analyze this patient's diabetes data. You can ask me about:
- A1C trends and hemoglobin levels
- Glucose patterns and blood sugar levels
- Medication compliance and adherence
- Recent appointments and visit summaries
- Weight trends and BMI
- Recent alerts or concerns
- General recommendations

What specific aspect would you like to know more about?`;
};
