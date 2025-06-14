'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import AuthWrapper from '../components/AuthWrapper';
import SubscriptionHandler from '../components/SubscriptionHandler';
import ProcessingStatus from '../components/ProcessingStatus';
import SummaryDisplay from '../components/SummaryDisplay';
import LandingPage from '../components/LandingPage';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';


const UploadZone = ({ onFileSelect, isProcessing, summaryLength, setSummaryLength }) => (
  <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
      
      {/* Left Sidebar - Summary Style */}
      <div className="lg:col-span-1 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-r border-gray-200">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-sm">⚙️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Summary Style</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { 
                key: 'brief', 
                label: 'Quick Brief', 
                desc: '1-2 min read', 
                icon: '⚡', 
                bgColor: 'from-emerald-400 to-green-500',
                features: ['Key points', 'Action items', 'Quick scan']
              },
              { 
                key: 'medium', 
                label: 'Balanced', 
                desc: '3-4 min read', 
                icon: '📊', 
                bgColor: 'from-blue-400 to-indigo-500',
                features: ['Detailed insights', 'Context', 'Decisions']
              },
              { 
                key: 'detailed', 
                label: 'Comprehensive', 
                desc: '5+ min read', 
                icon: '📖', 
                bgColor: 'from-purple-400 to-pink-500',
                features: ['Full analysis', 'Quotes', 'Deep insights']
              }
            ].map((option) => (
              <div key={option.key} className="relative">
                <button
                  onClick={() => setSummaryLength(option.key)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    summaryLength === option.key
                      ? 'border-indigo-300 bg-white shadow-lg scale-105'
                      : 'border-transparent bg-white/70 hover:bg-white/90 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      summaryLength === option.key 
                        ? `bg-gradient-to-br ${option.bgColor} text-white shadow-md` 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-lg">{option.icon}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`font-semibold ${summaryLength === option.key ? 'text-indigo-700' : 'text-gray-700'}`}>
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500">{option.desc}</div>
                    </div>
                    {summaryLength === option.key && (
                      <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Feature preview */}
                  <div className="flex flex-wrap gap-1">
                    {option.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-full ${
                          summaryLength === option.key
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* AI Enhancement Toggle */}
          <div className="mt-8 p-4 bg-white/80 rounded-xl border border-white/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">AI Enhancements</span>
              <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Smart topic detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Sentiment analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Follow-up suggestions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Upload Area */}
      <div className="lg:col-span-3 relative">
        <div className="p-8 h-full flex flex-col">
          
          {/* Header with smart tips */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Upload Your Meeting</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>AI Ready</span>
              </div>
            </div>
            
            {/* Smart Tips Bar */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">💡</span>
                <span><strong>Pro tip:</strong> 10-60 min recordings work best</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">🎯</span>
                <span>Supports MP3, M4A, WAV, WebM, MP4</span>
              </div>
            </div>
          </div>

          {/*  File Upload */}
          <div className="flex-1 flex items-center justify-center">
            <FileUpload onFileSelect={onFileSelect} isProcessing={isProcessing} />
          </div>

          {/* Processing Preview */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎵</span>
                </div>
                <div>
                  <div className="font-medium text-blue-800">Transcribe</div>
                  <div className="text-xs text-blue-600">Convert speech to text</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🧠</span>
                </div>
                <div>
                  <div className="font-medium text-purple-800">Analyze</div>
                  <div className="text-xs text-purple-600">Extract key insights</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📝</span>
                </div>
                <div>
                  <div className="font-medium text-emerald-800">Summarize</div>
                  <div className="text-xs text-emerald-600">Generate summary</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Status Indicator */}
        <div className="absolute top-6 right-6">
          <div className="bg-white rounded-full p-3 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">Ready to process</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

//  Processing Display with real-time insights
const ProcessingDisplay = ({ processingStep, summaryLength }) => (
  <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
    {/* Header with animated gradient */}
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">AI Processing Your Meeting</h3>
              <p className="text-indigo-100">Creating your {summaryLength} summary...</p>
            </div>
          </div>
          
          {/* Processing time estimate */}
          <div className="text-right">
            <div className="text-white/90 text-sm">Estimated time</div>
            <div className="text-white font-bold text-lg">2-3 minutes</div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="p-8">
      <ProcessingStatus status="processing" currentStep={processingStep} />
      
      {/* Real-time insights preview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white">🎯</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800">Smart Analysis</h4>
              <p className="text-sm text-blue-600">Identifying key topics and themes</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-blue-700">Analyzing speech patterns and context...</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white">📋</span>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-800">Action Items</h4>
              <p className="text-sm text-emerald-600">Extracting tasks and decisions</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '40%' }}></div>
            </div>
            <p className="text-xs text-emerald-700">Finding actionable items and next steps...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

//  Action Hub with more features
const ActionHub = ({ onStartOver, summary }) => (
  <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 border-b border-emerald-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">🚀</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-800">Share & Export</h3>
            <p className="text-emerald-600">Choose how you'd like to use your summary</p>
          </div>
        </div>
        <button 
          onClick={onStartOver} 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Process Another Meeting
        </button>
      </div>
    </div>
    
    <div className="p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: '📧', label: 'Email Summary', desc: 'Send to team', color: 'from-blue-400 to-blue-500', action: 'email' },
          { icon: '📋', label: 'Copy Actions', desc: 'Action items', color: 'from-green-400 to-emerald-500', action: 'copy' },
          { icon: '📄', label: 'Export PDF', desc: 'Download', color: 'from-red-400 to-pink-500', action: 'pdf' },
          { icon: '📅', label: 'Schedule', desc: 'Follow-ups', color: 'from-purple-400 to-indigo-500', action: 'calendar' }
        ].map((action, index) => (
          <button
            key={index}
            className="group relative bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          >
            <div className="text-center space-y-4">
              <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                <span className="text-white text-xl">{action.icon}</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800 group-hover:text-gray-900">{action.label}</div>
                <div className="text-sm text-gray-500">{action.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Quick Actions</h4>
        <div className="flex flex-wrap gap-3">
          <button className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            📊 Generate Report
          </button>
          <button className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            🔗 Create Shareable Link
          </button>
          <button className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            📱 Send to Slack
          </button>
          <button className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            💬 AI Chat About Meeting
          </button>
        </div>
      </div>
    </div>
  </div>
);

//  Error Display
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="bg-white rounded-3xl border border-red-200 shadow-lg overflow-hidden">
    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 border-b border-red-100">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-red-800">Processing Failed</h3>
          <p className="text-red-600">Don't worry, let's try that again</p>
        </div>
      </div>
    </div>
    
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRetry}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Try Again
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  </div>
);

// Smart Usage Alert with better design
const SmartAlert = ({ userUsage }) => {
  if (!userUsage || userUsage.plan !== 'free') return null;
  
  const remaining = userUsage.limit - userUsage.count;
  
  if (remaining === 1) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-800">Last Free Summary!</h3>
              <p className="text-amber-700 text-lg">Make it count, then unlock unlimited processing</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};

// Main Component (unchanged logic,  UI)
function HomeContent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [userUsage, setUserUsage] = useState(null);
  const [summaryLength, setSummaryLength] = useState('brief'); 
  const searchParams = useSearchParams();
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const intent = searchParams.get('intent');
    if (intent === 'pro') {
      setShowProUpgrade(true);
    }
  }, [searchParams]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl animate-pulse">
            <span className="text-white text-3xl">🎯</span>
          </div>
          <div className="space-y-3">
            <div className="w-40 h-4 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
            <div className="w-32 h-3 bg-gray-100 rounded-full animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  if (!isSignedIn) {
    return <LandingPage />;
  }

  const handleUsageCheck = (usage) => {
    setUserUsage(usage);
  };

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setError('');
    setSummary('');
    setIsProcessing(true);
    setProcessingStep('uploading');

    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('summaryLength', summaryLength);

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
      
      // Small delay to show summarizing step
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
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-12">
          <AuthWrapper>
            <SubscriptionHandler onUsageCheck={handleUsageCheck} showProUpgradeIntent={showProUpgrade}>
              
              {/* Smart Alerts */}
              <SmartAlert userUsage={userUsage} />

              {/* Main Content */}
              <div className="space-y-12">
                
                {/* Upload Interface */}
                {!summary && !isProcessing && (
                  <UploadZone 
                    onFileSelect={handleFileSelect} 
                    isProcessing={isProcessing}
                    summaryLength={summaryLength}
                    setSummaryLength={setSummaryLength}
                  />
                )}

                {/* Processing Display */}
                {isProcessing && (
                  <ProcessingDisplay 
                    processingStep={processingStep} 
                    summaryLength={summaryLength} 
                  />
                )}

                {/* Error Display */}
                {error && (
                  <ErrorDisplay error={error} onRetry={handleStartOver} />
                )}

                {/* Summary Results */}
                {summary && (
                  <div className="space-y-12">
                    <SummaryDisplay summary={summary} />
                    <ActionHub onStartOver={handleStartOver} summary={summary} />
                  </div>
                )}
                
              </div>

            </SubscriptionHandler>
          </AuthWrapper>
        </main>

        {/*  Footer */}
 
      </div>
    </Suspense>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}