import React, { useState } from 'react';
import { FileDown, CheckSquare, Square } from 'lucide-react';
import type { Patient } from '../../types';
import { getHealthDataByPatientId } from '../../data/mockHealthData';
import { getTranscriptsByPatientId } from '../../data/mockTranscripts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportTabProps {
  patient: Patient;
}

interface ExportSection {
  id: string;
  label: string;
  description: string;
}

const exportSections: ExportSection[] = [
  {
    id: 'patientInfo',
    label: 'Patient Demographics',
    description: 'Name, age, contact information, diagnosis date',
  },
  {
    id: 'vitalSigns',
    label: 'Vital Signs & Measurements',
    description: 'Height, weight, BMI, latest vitals',
  },
  {
    id: 'labResults',
    label: 'Laboratory Results',
    description: 'A1C trends, average glucose levels',
  },
  {
    id: 'medications',
    label: 'Medication Information',
    description: 'Current medications and compliance rate',
  },
  {
    id: 'healthData',
    label: 'Health Data Charts',
    description: 'Recent glucose readings, A1C history, weight trends',
  },
  {
    id: 'recentAppointment',
    label: 'Most Recent Appointment',
    description: 'Latest appointment summary and transcript',
  },
  {
    id: 'alerts',
    label: 'Active Alerts & Concerns',
    description: 'Current health alerts and recommendations',
  },
  {
    id: 'clinicalNotes',
    label: 'Clinical Notes',
    description: 'Additional notes and observations',
  },
];

const ExportTab: React.FC<ExportTabProps> = ({ patient }) => {
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(['patientInfo', 'vitalSigns', 'labResults', 'medications', 'healthData', 'recentAppointment', 'alerts'])
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const toggleSection = (sectionId: string) => {
    const newSelected = new Set(selectedSections);
    if (newSelected.has(sectionId)) {
      newSelected.delete(sectionId);
    } else {
      newSelected.add(sectionId);
    }
    setSelectedSections(newSelected);
  };

  const generatePDF = () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('PATIENT HEALTH RECORD', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Confidentiality Notice
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const confidentialityText = 'CONFIDENTIAL MEDICAL RECORD - Protected Health Information';
      doc.text(confidentialityText, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      doc.setTextColor(0, 0, 0);

      // Patient Demographics
      if (selectedSections.has('patientInfo')) {
        yPosition = checkPageBreak(doc, yPosition, 40);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PATIENT DEMOGRAPHICS', 14, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const demographics = [
          ['Full Name:', patient.name],
          ['Patient ID:', patient.id],
          ['Age:', `${patient.age} years`],
          ['Date of Birth:', calculateDOB(patient.age)],
          ['Email:', patient.email],
          ['Phone:', patient.phone],
          ['Diagnosis Date:', new Date(patient.diagnosisDate).toLocaleDateString()],
          ['Years with Diabetes:', `${calculateYearsSinceDiagnosis(patient.diagnosisDate)} years`],
        ];

        demographics.forEach(([label, value]) => {
          doc.setFont('helvetica', 'bold');
          doc.text(label, 20, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(value, 70, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Vital Signs & Measurements
      if (selectedSections.has('vitalSigns')) {
        yPosition = checkPageBreak(doc, yPosition, 40);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('VITAL SIGNS & MEASUREMENTS', 14, yPosition);
        yPosition += 8;

        const bmi = (patient.weight / Math.pow(patient.height, 2)) * 703;

        autoTable(doc, {
          startY: yPosition,
          head: [['Measurement', 'Value', 'Status']],
          body: [
            ['Height', `${patient.height} inches (${(patient.height * 2.54).toFixed(1)} cm)`, '—'],
            ['Weight', `${patient.weight} lbs (${(patient.weight * 0.453592).toFixed(1)} kg)`, getBMIStatus(bmi)],
            ['BMI', bmi.toFixed(1), getBMICategory(bmi)],
          ],
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          styles: { fontSize: 10 },
          margin: { left: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Laboratory Results
      if (selectedSections.has('labResults')) {
        yPosition = checkPageBreak(doc, yPosition, 50);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('LABORATORY RESULTS', 14, yPosition);
        yPosition += 8;

        const healthData = getHealthDataByPatientId(patient.id);
        const latestA1C = healthData?.a1cReadings[healthData.a1cReadings.length - 1];

        autoTable(doc, {
          startY: yPosition,
          head: [['Test', 'Result', 'Reference Range', 'Status']],
          body: [
            [
              'HbA1c (Hemoglobin A1C)',
              `${patient.latestA1C.toFixed(2)}%`,
              '< 7.0% (Target)',
              getA1CStatus(patient.latestA1C),
            ],
            [
              'Average Glucose',
              `${patient.averageGlucose} mg/dL`,
              '70-130 mg/dL (Fasting)',
              getGlucoseStatus(patient.averageGlucose),
            ],
            [
              'Last A1C Test Date',
              latestA1C ? new Date(latestA1C.date).toLocaleDateString() : 'N/A',
              '—',
              '—',
            ],
          ],
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          styles: { fontSize: 10 },
          margin: { left: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Medications
      if (selectedSections.has('medications')) {
        yPosition = checkPageBreak(doc, yPosition, 40);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('MEDICATION INFORMATION', 14, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Medication Compliance Rate: ${patient.medicationCompliance}%`, 20, yPosition);
        yPosition += 6;

        const complianceStatus = patient.medicationCompliance >= 90 ? 'Excellent' :
                                patient.medicationCompliance >= 80 ? 'Good' :
                                patient.medicationCompliance >= 70 ? 'Fair' : 'Needs Improvement';
        doc.text(`Compliance Assessment: ${complianceStatus}`, 20, yPosition);
        yPosition += 10;
      }

      // Health Data Charts Summary
      if (selectedSections.has('healthData')) {
        yPosition = checkPageBreak(doc, yPosition, 60);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('HEALTH DATA SUMMARY', 14, yPosition);
        yPosition += 8;

        const healthData = getHealthDataByPatientId(patient.id);

        if (healthData) {
          // Recent Glucose Readings (last 7 days)
          const recentGlucose = healthData.glucoseReadings.slice(-21); // Last 7 days (3 per day)
          const glucoseValues = recentGlucose.map(r => `${r.value} mg/dL`);

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Recent Glucose Readings (Last 7 Days)', 20, yPosition);
          yPosition += 6;

          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          const avgRecent = Math.round(recentGlucose.reduce((sum, r) => sum + r.value, 0) / recentGlucose.length);
          doc.text(`Average: ${avgRecent} mg/dL | Range: ${Math.min(...recentGlucose.map(r => r.value))}-${Math.max(...recentGlucose.map(r => r.value))} mg/dL`, 20, yPosition);
          yPosition += 10;

          // A1C Trend (last 4 quarters)
          const recentA1C = healthData.a1cReadings.slice(-4);

          autoTable(doc, {
            startY: yPosition,
            head: [['Date', 'A1C Value', 'Trend']],
            body: recentA1C.map((reading, idx) => {
              const prevReading = idx > 0 ? recentA1C[idx - 1] : null;
              const trend = prevReading
                ? reading.value < prevReading.value ? '↓ Improving'
                : reading.value > prevReading.value ? '↑ Increasing'
                : '→ Stable'
                : '—';
              return [
                new Date(reading.date).toLocaleDateString(),
                `${reading.value.toFixed(1)}%`,
                trend,
              ];
            }),
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 9 },
            margin: { left: 20 },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 10;
        }
      }

      // Recent Appointment
      if (selectedSections.has('recentAppointment')) {
        yPosition = checkPageBreak(doc, yPosition, 50);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('MOST RECENT APPOINTMENT', 14, yPosition);
        yPosition += 8;

        const transcripts = getTranscriptsByPatientId(patient.id);
        if (transcripts.length > 0) {
          const latestTranscript = transcripts[transcripts.length - 1];

          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`Date: ${new Date(latestTranscript.date).toLocaleDateString()}`, 20, yPosition);
          yPosition += 6;
          doc.text(`Duration: ${latestTranscript.duration} minutes`, 20, yPosition);
          yPosition += 10;

          doc.setFont('helvetica', 'bold');
          doc.text('Appointment Summary:', 20, yPosition);
          yPosition += 6;

          doc.setFont('helvetica', 'normal');
          const summaryLines = doc.splitTextToSize(latestTranscript.summary, pageWidth - 40);
          summaryLines.forEach((line: string) => {
            yPosition = checkPageBreak(doc, yPosition, 10);
            doc.text(line, 20, yPosition);
            yPosition += 5;
          });
          yPosition += 5;
        } else {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.text('No appointment transcripts available.', 20, yPosition);
          yPosition += 10;
        }
      }

      // Active Alerts
      if (selectedSections.has('alerts')) {
        yPosition = checkPageBreak(doc, yPosition, 40);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('ACTIVE ALERTS & CONCERNS', 14, yPosition);
        yPosition += 8;

        if (patient.recentAlerts && patient.recentAlerts.length > 0) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');

          patient.recentAlerts.forEach((alert, index) => {
            yPosition = checkPageBreak(doc, yPosition, 10);
            doc.setFont('helvetica', 'bold');
            doc.text(`${index + 1}.`, 20, yPosition);
            doc.setFont('helvetica', 'normal');
            const alertLines = doc.splitTextToSize(alert, pageWidth - 50);
            doc.text(alertLines, 28, yPosition);
            yPosition += (alertLines.length * 5) + 2;
          });
          yPosition += 5;
        } else {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.text('No active alerts at this time.', 20, yPosition);
          yPosition += 10;
        }
      }

      // Clinical Notes
      if (selectedSections.has('clinicalNotes') && additionalNotes.trim()) {
        yPosition = checkPageBreak(doc, yPosition, 40);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('ADDITIONAL CLINICAL NOTES', 14, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const notesLines = doc.splitTextToSize(additionalNotes, pageWidth - 40);
        notesLines.forEach((line: string) => {
          yPosition = checkPageBreak(doc, yPosition, 10);
          doc.text(line, 20, yPosition);
          yPosition += 5;
        });
        yPosition += 10;
      }

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        'This document contains confidential medical information. Unauthorized disclosure is prohibited.',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Save the PDF
      const fileName = `${patient.name.replace(/\s+/g, '_')}_Health_Record_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      setIsGenerating(false);
    }
  };

  // Helper function to check if we need a page break
  const checkPageBreak = (doc: jsPDF, currentY: number, requiredSpace: number): number => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (currentY + requiredSpace > pageHeight - 20) {
      doc.addPage();
      return 20; // Return to top of new page
    }
    return currentY;
  };

  // Helper functions for status
  const getBMIStatus = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight ⚠️';
    if (bmi < 25) return 'Normal ✓';
    if (bmi < 30) return 'Overweight ⚠️';
    return 'Obese ⚠️';
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal Weight';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obese (Class I)';
    if (bmi < 40) return 'Obese (Class II)';
    return 'Obese (Class III)';
  };

  const getA1CStatus = (a1c: number): string => {
    if (a1c < 5.7) return 'Normal';
    if (a1c < 6.5) return 'Prediabetic';
    if (a1c < 7.0) return 'Diabetic - Good Control';
    if (a1c < 8.0) return 'Diabetic - Fair Control';
    return 'Diabetic - Poor Control';
  };

  const getGlucoseStatus = (glucose: number): string => {
    if (glucose < 70) return 'Low';
    if (glucose <= 130) return 'Normal';
    if (glucose <= 180) return 'Elevated';
    return 'High';
  };

  const calculateDOB = (age: number): string => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return `~${birthYear}`;
  };

  const calculateYearsSinceDiagnosis = (diagnosisDate: string): number => {
    const today = new Date();
    const diagnosis = new Date(diagnosisDate);
    return Math.floor((today.getTime() - diagnosis.getTime()) / (1000 * 60 * 60 * 24 * 365));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start space-x-3">
          <FileDown className="h-6 w-6 text-primary-600 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Export Patient Health Record</h2>
            <p className="text-sm text-gray-600 mt-1">
              Generate a comprehensive PDF document with selected patient information for official records,
              referrals, or patient requests.
            </p>
          </div>
        </div>
      </div>

      {/* Section Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Information to Include</h3>
        <div className="space-y-3">
          {exportSections.map((section) => (
            <div
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className="flex items-start space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-primary-300 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {selectedSections.has(section.id) ? (
                <CheckSquare className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Square className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-900">{section.label}</div>
                <div className="text-sm text-gray-600">{section.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      {selectedSections.has('clinicalNotes') && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Clinical Notes</h3>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter any additional clinical notes, observations, or recommendations to include in the exported document..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>
      )}

      {/* Export Button */}
      <div className="card bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Ready to Export</h3>
            <p className="text-sm text-gray-600 mt-1">
              {selectedSections.size} section{selectedSections.size !== 1 ? 's' : ''} selected
            </p>
          </div>
          <button
            onClick={generatePDF}
            disabled={isGenerating || selectedSections.size === 0}
            className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="h-5 w-5" />
            <span>{isGenerating ? 'Generating PDF...' : 'Generate PDF Document'}</span>
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="card bg-blue-50 border-2 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">HIPAA Compliance Notice</h3>
        <p className="text-sm text-gray-700">
          Exported documents contain Protected Health Information (PHI). Ensure proper handling, storage, and
          transmission in accordance with HIPAA regulations. Always obtain patient consent before sharing medical
          records with third parties.
        </p>
      </div>
    </div>
  );
};

export default ExportTab;
