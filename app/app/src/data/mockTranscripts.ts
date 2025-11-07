import type { AppointmentTranscript, TranscriptMessage } from '../types';

const createTranscript = (
  id: string,
  patientId: string,
  date: string,
  duration: number,
  summary: string,
  messages: Array<{ speaker: 'doctor' | 'patient'; message: string; minutesOffset: number }>
): AppointmentTranscript => {
  const baseTime = new Date(date + 'T09:00:00');

  const fullTranscript: TranscriptMessage[] = messages.map(msg => {
    const timestamp = new Date(baseTime.getTime() + msg.minutesOffset * 60000);
    return {
      timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      speaker: msg.speaker,
      message: msg.message,
    };
  });

  return {
    id,
    patientId,
    date,
    duration,
    summary,
    fullTranscript,
  };
};

export const mockTranscripts: AppointmentTranscript[] = [
  // Sarah Johnson's transcripts
  createTranscript(
    't1-1',
    '1',
    '2025-10-20',
    25,
    'Routine follow-up. Patient reports improved glucose control. Discussed dietary changes and exercise routine. A1C remains stable at 7.2%.',
    [
      { speaker: 'doctor', message: 'Good morning, Sarah! How have you been feeling since our last visit?', minutesOffset: 0 },
      { speaker: 'patient', message: 'Hi Dr. Smith! I\'ve been doing pretty well. I\'ve been trying to walk more like you suggested.', minutesOffset: 0.5 },
      { speaker: 'doctor', message: 'That\'s great to hear! How many days a week are you walking?', minutesOffset: 1 },
      { speaker: 'patient', message: 'About 4 to 5 days. I usually do 30 minutes after dinner.', minutesOffset: 1.5 },
      { speaker: 'doctor', message: 'Excellent! That\'s making a real difference. Let\'s look at your glucose logs. I can see your numbers have been more consistent.', minutesOffset: 2 },
      { speaker: 'patient', message: 'Yes, I\'ve noticed that too. I\'ve been better about checking before meals.', minutesOffset: 3 },
      { speaker: 'doctor', message: 'Your A1C is holding steady at 7.2%, which is good. Have you had any episodes of low blood sugar?', minutesOffset: 4 },
      { speaker: 'patient', message: 'Just once, last week. I think I skipped lunch and took my medication anyway.', minutesOffset: 5 },
      { speaker: 'doctor', message: 'It\'s really important not to skip meals, especially when you\'re taking your medication. Let\'s review your meal timing.', minutesOffset: 6 },
      { speaker: 'patient', message: 'You\'re right. I\'ve been trying to meal prep on Sundays so I have healthy options ready.', minutesOffset: 7 },
      { speaker: 'doctor', message: 'That\'s a smart strategy. How about your carbohydrate counting? Are you still finding that helpful?', minutesOffset: 8 },
      { speaker: 'patient', message: 'Yes, it\'s become second nature now. I use the app you recommended.', minutesOffset: 9 },
      { speaker: 'doctor', message: 'Perfect. I want you to continue with your current medication regimen. You\'re doing a great job managing your diabetes.', minutesOffset: 10 },
      { speaker: 'patient', message: 'Thank you! Should I make any changes to my insulin dosage?', minutesOffset: 11 },
      { speaker: 'doctor', message: 'No, your current dosage seems to be working well. Just keep monitoring and logging your readings.', minutesOffset: 12 },
      { speaker: 'patient', message: 'Will do. When should I come back for my next visit?', minutesOffset: 13 },
      { speaker: 'doctor', message: 'Let\'s schedule you for 3 months from now. We\'ll do another A1C test then.', minutesOffset: 14 },
    ]
  ),

  createTranscript(
    't1-2',
    '1',
    '2025-07-15',
    30,
    'Patient experiencing stress-related glucose spikes. Discussed stress management techniques and adjusted evening insulin dose. Will monitor closely.',
    [
      { speaker: 'doctor', message: 'Hello Sarah. I noticed some unusual patterns in your glucose readings this month. Want to talk about that?', minutesOffset: 0 },
      { speaker: 'patient', message: 'Yes, I\'ve been really stressed at work. There\'s been some major changes and I think it\'s affecting my numbers.', minutesOffset: 0.5 },
      { speaker: 'doctor', message: 'Stress can definitely impact blood sugar. Tell me more about what\'s been going on.', minutesOffset: 1.5 },
      { speaker: 'patient', message: 'We\'re going through a reorganization. Long hours, lots of uncertainty. I haven\'t been sleeping well either.', minutesOffset: 2 },
      { speaker: 'doctor', message: 'I can see your evening readings are higher than usual. The stress hormones can cause that. How\'s your diet been?', minutesOffset: 3 },
      { speaker: 'patient', message: 'Honestly, not great. I\'ve been eating out more, grabbing whatever is quick.', minutesOffset: 4 },
      { speaker: 'doctor', message: 'That\'s understandable given the circumstances. Let\'s work on a plan to help manage this better. First, let\'s talk about stress reduction.', minutesOffset: 5 },
      { speaker: 'patient', message: 'I\'m open to suggestions. I know I need to do better.', minutesOffset: 6 },
      { speaker: 'doctor', message: 'Have you tried any relaxation techniques? Even 10 minutes of deep breathing before bed could help.', minutesOffset: 7 },
      { speaker: 'patient', message: 'No, but I\'m willing to try. Do you have any resources?', minutesOffset: 8 },
      { speaker: 'doctor', message: 'I\'ll send you some links to guided meditation apps. Also, I\'d like to slightly adjust your evening insulin to help with those higher readings.', minutesOffset: 9 },
      { speaker: 'patient', message: 'Okay. By how much?', minutesOffset: 10 },
      { speaker: 'doctor', message: 'Let\'s increase it by 2 units for now. Continue monitoring closely and call me if you see any issues.', minutesOffset: 11 },
    ]
  ),

  // Michael Chen's transcripts
  createTranscript(
    't2-1',
    '2',
    '2025-10-28',
    20,
    'Excellent progress. Patient has maintained A1C below 7.0% for three consecutive quarters. Continue current management plan.',
    [
      { speaker: 'doctor', message: 'Michael! Great to see you. Your numbers look fantastic.', minutesOffset: 0 },
      { speaker: 'patient', message: 'Thank you! I\'ve been working hard to stay on track.', minutesOffset: 0.5 },
      { speaker: 'doctor', message: 'It shows. Your A1C is 6.8% - that\'s the third quarter in a row below 7. What\'s your secret?', minutesOffset: 1 },
      { speaker: 'patient', message: 'Consistency, I think. Same routine every day - meals, exercise, medication at the same times.', minutesOffset: 2 },
      { speaker: 'doctor', message: 'That discipline is paying off. Any issues with hypoglycemia?', minutesOffset: 3 },
      { speaker: 'patient', message: 'No, I keep glucose tablets with me just in case, but I haven\'t needed them in months.', minutesOffset: 4 },
      { speaker: 'doctor', message: 'Perfect. How about your diet? Still following the meal plan we discussed?', minutesOffset: 5 },
      { speaker: 'patient', message: 'Yes, my wife has been great about helping with meal prep. We cook together on weekends.', minutesOffset: 6 },
      { speaker: 'doctor', message: 'That\'s wonderful. Support from family makes such a difference. Let\'s keep everything as is - no changes needed.', minutesOffset: 7 },
      { speaker: 'patient', message: 'Sounds good. I\'ll see you in three months?', minutesOffset: 8 },
      { speaker: 'doctor', message: 'Yes, and keep up the excellent work!', minutesOffset: 9 },
    ]
  ),

  // Emily Rodriguez's transcripts
  createTranscript(
    't3-1',
    '3',
    '2025-11-01',
    35,
    'Concerning A1C increase to 8.1%. Discussed medication adherence issues and barriers to care. Adjusted treatment plan and scheduled more frequent follow-ups.',
    [
      { speaker: 'doctor', message: 'Hi Emily, thanks for coming in. I want to talk about your recent test results.', minutesOffset: 0 },
      { speaker: 'patient', message: 'I know they\'re not good. I\'m sorry.', minutesOffset: 0.5 },
      { speaker: 'doctor', message: 'There\'s no need to apologize. I\'m here to help. Your A1C has gone up to 8.1%. Help me understand what\'s been happening.', minutesOffset: 1 },
      { speaker: 'patient', message: 'It\'s been really hard. I lost my job last month and I\'m worried about affording my medications.', minutesOffset: 2 },
      { speaker: 'doctor', message: 'I\'m sorry to hear that. Have you been taking your medications regularly?', minutesOffset: 3 },
      { speaker: 'patient', message: 'I\'ve been trying to stretch them out to make them last longer. I know that\'s not good.', minutesOffset: 4 },
      { speaker: 'doctor', message: 'Thank you for being honest. That\'s important. There are programs that can help with medication costs. Let me connect you with our patient assistance coordinator.', minutesOffset: 5 },
      { speaker: 'patient', message: 'Really? I didn\'t know that was an option.', minutesOffset: 6 },
      { speaker: 'doctor', message: 'Yes, we have several options. Also, I want to make sure you\'re eating regularly. Has that been a challenge?', minutesOffset: 7 },
      { speaker: 'patient', message: 'Sometimes. Money is tight right now.', minutesOffset: 8 },
      { speaker: 'doctor', message: 'I understand. I\'ll also give you information about local food assistance programs. Your health is too important to let financial issues get in the way.', minutesOffset: 9 },
      { speaker: 'patient', message: 'Thank you. I\'ve been so stressed about this.', minutesOffset: 10 },
      { speaker: 'doctor', message: 'We\'re going to work through this together. I want to see you back in one month instead of three, okay? Let\'s keep a closer eye on things.', minutesOffset: 11 },
      { speaker: 'patient', message: 'Okay. I really appreciate your help.', minutesOffset: 12 },
    ]
  ),

  // Robert Thompson's transcripts
  createTranscript(
    't4-1',
    '4',
    '2025-10-15',
    28,
    'Routine check-up. Patient reports occasional morning highs. Reviewed basal insulin timing. May need adjustment if pattern continues. Weight loss progress noted.',
    [
      { speaker: 'doctor', message: 'Good morning, Robert. How have things been?', minutesOffset: 0 },
      { speaker: 'patient', message: 'Morning, Doc. Pretty good overall, but I\'ve noticed my morning readings are higher than I\'d like.', minutesOffset: 0.5 },
      { speaker: 'doctor', message: 'I see that in your log. What time are you taking your basal insulin?', minutesOffset: 1 },
      { speaker: 'patient', message: 'Around 10 PM, before bed.', minutesOffset: 2 },
      { speaker: 'doctor', message: 'Let\'s try moving it a bit earlier, maybe 8 PM. That might help with the morning readings.', minutesOffset: 3 },
      { speaker: 'patient', message: 'I can do that. Should I change the dose too?', minutesOffset: 4 },
      { speaker: 'doctor', message: 'Not yet. Let\'s see if the timing change helps first. Monitor it for two weeks and let me know.', minutesOffset: 5 },
      { speaker: 'patient', message: 'Will do. On a positive note, I\'ve lost 8 pounds since my last visit.', minutesOffset: 6 },
      { speaker: 'doctor', message: 'That\'s excellent! What have you been doing differently?', minutesOffset: 7 },
      { speaker: 'patient', message: 'I joined a senior fitness class at the community center. Three times a week.', minutesOffset: 8 },
      { speaker: 'doctor', message: 'That\'s wonderful. Physical activity plus the weight loss should help improve your insulin sensitivity.', minutesOffset: 9 },
    ]
  ),

  // Jennifer Park's transcripts
  createTranscript(
    't5-1',
    '5',
    '2025-11-05',
    22,
    'Outstanding control. A1C at 6.5% with 98% medication compliance. Patient is model example of diabetes management. No changes needed.',
    [
      { speaker: 'doctor', message: 'Jennifer, your results are outstanding as always. A1C at 6.5%.', minutesOffset: 0 },
      { speaker: 'patient', message: 'Thank you! I really try to stay on top of everything.', minutesOffset: 0.5 },
      { speaker: 'doctor', message: 'Your medication compliance is 98%. That\'s remarkable. What helps you stay so consistent?', minutesOffset: 1 },
      { speaker: 'patient', message: 'I have alarms set on my phone for everything - medication, meals, testing. It\'s just part of my routine now.', minutesOffset: 2 },
      { speaker: 'doctor', message: 'That system is clearly working perfectly. Any concerns or questions?', minutesOffset: 3 },
      { speaker: 'patient', message: 'No major concerns. I did want to ask about the new continuous glucose monitor I\'ve been hearing about.', minutesOffset: 4 },
      { speaker: 'doctor', message: 'With your excellent control, it\'s not medically necessary, but if you\'re interested in the data and convenience, we could certainly discuss it.', minutesOffset: 5 },
      { speaker: 'patient', message: 'I think I\'ll stick with what I\'m doing for now. It\'s working well.', minutesOffset: 6 },
      { speaker: 'doctor', message: 'Absolutely. Don\'t fix what isn\'t broken. Keep doing exactly what you\'re doing. I\'ll see you in three months.', minutesOffset: 7 },
    ]
  ),
];

// Helper function to get transcripts by patient ID
export const getTranscriptsByPatientId = (patientId: string): AppointmentTranscript[] => {
  return mockTranscripts.filter(transcript => transcript.patientId === patientId);
};

// Helper function to get a specific transcript
export const getTranscriptById = (id: string): AppointmentTranscript | undefined => {
  return mockTranscripts.find(transcript => transcript.id === id);
};
