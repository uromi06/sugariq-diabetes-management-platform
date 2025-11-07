import React, { useState, useEffect, useRef } from 'react';
import type { Patient } from '../../types';
import { Video, Mic, PhoneOff, Play, Square } from 'lucide-react';

interface LiveSessionTabProps {
  patient: Patient;
}

const LiveSessionTab: React.FC<LiveSessionTabProps> = ({ patient }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSessionActive) {
      intervalRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSessionActive]);

  const startSession = () => {
    setIsSessionActive(true);
    setSessionDuration(0);
    setTranscript([]);

    // Simulate live transcription appearing
    setTimeout(() => {
      addTranscriptLine('Doctor: Good morning! How have you been feeling since our last visit?');
    }, 2000);

    setTimeout(() => {
      addTranscriptLine(`Patient: Hi Doctor! I've been doing okay, trying to manage my blood sugar better.`);
    }, 5000);

    setTimeout(() => {
      addTranscriptLine('Doctor: That\'s great to hear. Let\'s review your recent glucose readings.');
    }, 8000);

    setTimeout(() => {
      addTranscriptLine('Patient: I\'ve been checking three times a day like you recommended.');
    }, 11000);
  };

  const endSession = () => {
    setIsSessionActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const addTranscriptLine = (line: string) => {
    setTranscript((prev) => [...prev, line]);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {!isSessionActive ? (
        /* Pre-Session View */
        <div className="card text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-primary-100 rounded-full">
              <Video className="h-16 w-16 text-primary-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Live Appointment</h2>
          <p className="text-gray-600 mb-8">
            Begin a virtual appointment with {patient.name}. The session will be automatically transcribed in
            real-time.
          </p>
          <button onClick={startSession} className="btn-primary inline-flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Start Appointment</span>
          </button>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Session Features:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Real-time transcription of conversation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Automatic session recording</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>AI-powered session summary</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Secure and HIPAA compliant</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        /* Active Session View */
        <div className="space-y-6">
          {/* Session Header */}
          <div className="card bg-primary-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-gray-900">Live Session</span>
                </div>
                <span className="text-gray-600">|</span>
                <span className="font-mono text-gray-900">{formatDuration(sessionDuration)}</span>
              </div>
              <button
                onClick={endSession}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <PhoneOff className="h-5 w-5" />
                <span>End Appointment</span>
              </button>
            </div>
          </div>

          {/* Video Placeholder */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card bg-gray-900 text-white aspect-video flex items-center justify-center">
              <div className="text-center">
                <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">Patient Video</p>
                <p className="text-xs text-gray-500 mt-1">{patient.name}</p>
              </div>
            </div>
            <div className="card bg-gray-800 text-white aspect-video flex items-center justify-center">
              <div className="text-center">
                <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">Your Video</p>
                <p className="text-xs text-gray-500 mt-1">Dr. Smith</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="card">
            <div className="flex items-center justify-center space-x-4">
              <button className="p-4 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors">
                <Mic className="h-6 w-6 text-gray-700" />
              </button>
              <button className="p-4 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors">
                <Video className="h-6 w-6 text-gray-700" />
              </button>
              <button className="p-4 bg-primary-600 hover:bg-primary-700 rounded-full transition-colors">
                <Square className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {/* Live Transcription */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Transcription</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></div>
                <span>Transcribing...</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              {transcript.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Transcription will appear here as the conversation progresses...
                </p>
              ) : (
                <div className="space-y-3">
                  {transcript.map((line, index) => {
                    const isDoctor = line.startsWith('Doctor:');
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          isDoctor ? 'bg-primary-50 border border-primary-100' : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm text-gray-900">{line}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSessionTab;
