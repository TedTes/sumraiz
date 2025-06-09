'use client';

import { useState } from 'react';
import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import ProcessingStatus from '../components/ProcessingStatus';
import SummaryDisplay from '../components/SummaryDisplay';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setError('');
    setSummary('');
    setIsProcessing(true);
    setProcessingStep('uploading');

    try {
      const formData = new FormData();
      formData.append('audio', file);

      setProcessingStep('transcribing');
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process audio');
      }

      setProcessingStep('summarizing');
      
      // Small delay to show the summarizing step
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('complete');
      setSummary(result.summary);
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'An error occurred while processing your file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setProcessingStep('');
    setSummary('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Transform Meeting Recordings into Actionable Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your meeting audio and get structured summaries with key decisions, 
            action items, and next steps in just minutes.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {!summary && !isProcessing && (
            <FileUpload 
              onFileSelect={handleFileSelect} 
              isProcessing={isProcessing}
            />
          )}

          {isProcessing && (
            <ProcessingStatus 
              status="processing" 
              currentStep={processingStep}
            />
          )}

          {error && (
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Processing Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={handleStartOver}
                  className="mt-4 text-sm bg-red-100 text-red-800 px-3 py-2 rounded-md hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {summary && (
            <>
              <SummaryDisplay summary={summary} />
              
              <div className="text-center">
                <button
                  onClick={handleStartOver}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  Process Another Meeting
                </button>
              </div>
            </>
          )}
        </div>

        {/* Features Section */}
        {!summary && !isProcessing && (
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Transcription</h3>
              <p className="text-gray-600">Advanced AI converts speech to text with high accuracy</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Structured Summaries</h3>
              <p className="text-gray-600">Organized sections for decisions, action items, and next steps</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600">Get comprehensive summaries in minutes instead of hours</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>MeetingMind - Built with Next.js and OpenAI</p>
            <p className="mt-2">Transform your meetings into actionable insights</p>
          </div>
        </div>
      </footer>
    </div>
  );
}