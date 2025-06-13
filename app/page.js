'use client';

import { useState,useEffect,Suspense } from 'react';
import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import AuthWrapper from '../components/AuthWrapper';
import SubscriptionHandler from '../components/SubscriptionHandler';
import ProcessingStatus from '../components/ProcessingStatus';
import SummaryDisplay from '../components/SummaryDisplay';
import LandingPage from '../components/LandingPage';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';


// Enhanced Upload Zone - File upload first, compact sidebar for settings
const UploadZone = ({ onFileSelect, isProcessing, summaryLength, setSummaryLength }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    

    <div className="p-8">
      <FileUpload onFileSelect={onFileSelect} isProcessing={isProcessing} />
    </div>
    
    {/* Compact Settings and Info Section */}
    <div className="bg-gray-50 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        
        <div className="lg:col-span-1">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm font-medium text-gray-700">Summary Style</span>
            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center cursor-help" title="Choose how detailed you want your summary to be">
              <span className="text-xs text-gray-600">?</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {[
              { key: 'brief', label: 'Brief', desc: '1-2 min read', icon: '⚡', bgColor: 'from-green-400 to-emerald-500' },
              { key: 'medium', label: 'Standard', desc: '3-4 min read', icon: '📊', bgColor: 'from-blue-400 to-indigo-500' },
              { key: 'detailed', label: 'Detailed', desc: '5+ min read', icon: '📖', bgColor: 'from-purple-400 to-pink-500' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setSummaryLength(option.key)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  summaryLength === option.key
                    ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  summaryLength === option.key 
                    ? `bg-gradient-to-br ${option.bgColor} text-white` 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className="text-sm">{option.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800 text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </div>
                {summaryLength === option.key && (
                  <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right: File Info Cards - More compact grid */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">File Requirements</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
              <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                <span className="text-green-600 text-xs">📁</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Formats</div>
                <div className="text-xs text-gray-600">MP3, M4A, WAV, WebM, MP4</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
              <div className="w-6 h-6 bg-yellow-100 rounded-md flex items-center justify-center">
                <span className="text-yellow-600 text-xs">⚡</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Max Size</div>
                <div className="text-xs text-gray-600">50MB per file</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
              <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                <span className="text-purple-600 text-xs">⏱️</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Processing</div>
                <div className="text-xs text-gray-600">2-3 minutes</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                <span className="text-blue-600 text-xs">🎯</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Optimal</div>
                <div className="text-xs text-gray-600">10-60 min recordings</div>
              </div>
            </div>
          </div>
          
          {/* Current selection indicator */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm font-medium text-indigo-800">
                Selected: {summaryLength === 'brief' ? 'Brief summary (1-2 min read)' : 
                summaryLength === 'medium' ? 'Standard summary (3-4 min read)' : 'Detailed summary (5+ min read)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Processing Display
const ProcessingDisplay = ({ processingStep, summaryLength }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Processing Your Meeting</h3>
          <p className="text-indigo-100">Creating your {summaryLength} summary...</p>
        </div>
      </div>
    </div>
    
    <div className="p-6">
      <ProcessingStatus status="processing" currentStep={processingStep} />
      
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-sm">💡</span>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">AI Processing in Progress</p>
            <p className="text-xs text-blue-600">
              Analyzing speech patterns, identifying key topics, and extracting actionable items
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Error Display
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 border-b border-red-100">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <span className="text-red-600 text-xl">⚠️</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-red-800">Processing Failed</h3>
          <p className="text-red-600">Something went wrong, but we can try again</p>
        </div>
      </div>
    </div>
    
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Try Again
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  </div>
);

// Enhanced Action Hub for Export & Share
const ActionHub = ({ onStartOver }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-lg">🚀</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-800">Export & Share</h3>
            <p className="text-emerald-600">Choose how you'd like to use your summary</p>
          </div>
        </div>
        <button 
          onClick={onStartOver} 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Process Another Meeting
        </button>
      </div>
    </div>
    
    <div className="p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '📧', label: 'Email', desc: 'Send summary', color: 'from-blue-400 to-blue-500' },
          { icon: '📋', label: 'Copy Items', desc: 'Action items', color: 'from-green-400 to-emerald-500' },
          { icon: '📄', label: 'Export PDF', desc: 'Download', color: 'from-red-400 to-pink-500' },
          { icon: '📅', label: 'Schedule', desc: 'Follow-ups', color: 'from-purple-400 to-indigo-500' }
        ].map((action, index) => (
          <button
            key={index}
            className="group relative bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
          >
            <div className="text-center space-y-3">
              <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                <span className="text-white text-lg">{action.icon}</span>
              </div>
              <div>
                <div className="font-medium text-gray-800 group-hover:text-gray-900">{action.label}</div>
                <div className="text-xs text-gray-500">{action.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// First Summary Celebration
const CelebrationBanner = ({ userUsage }) => {
  if (!userUsage || userUsage.count !== 1) return null;
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border border-emerald-200 shadow-sm">
      <div className="absolute top-0 right-0 -translate-y-8 translate-x-8">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full opacity-30 blur-xl"></div>
      </div>
      
      <div className="relative p-8">
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🎉</span>
          </div>
          
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-emerald-800 mb-2">
              Congratulations on your first summary!
            </h4>
            <p className="text-emerald-700 text-lg mb-4">
              You have <span className="font-bold">{userUsage.limit - userUsage.count}</span> free summaries remaining in your trial.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Multiple export formats', icon: '✨', color: 'bg-emerald-100 text-emerald-800' },
                { label: 'Easy sharing options', icon: '📧', color: 'bg-teal-100 text-teal-800' },
                { label: 'Action item tracking', icon: '📊', color: 'bg-cyan-100 text-cyan-800' },
                { label: 'Smart insights', icon: '🧠', color: 'bg-blue-100 text-blue-800' }
              ].map((feature, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center space-x-2 ${feature.color} px-4 py-2 rounded-full text-sm font-medium shadow-sm`}
                >
                  <span>{feature.icon}</span>
                  <span>{feature.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Smart Alert Component
const SmartAlert = ({ userUsage }) => {
  if (!userUsage || userUsage.plan !== 'free') return null;
  
  const remaining = userUsage.limit - userUsage.count;
  
  if (remaining === 1) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-800">Last Free Summary!</h3>
              <p className="text-amber-700">Make it count, then unlock unlimited processing</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg">
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};

// Main Component
export default function Home() {
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
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white text-2xl">🎯</span>
          </div>
          <div className="space-y-2">
            <div className="w-32 h-3 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
            <div className="w-24 h-2 bg-gray-100 rounded-full animate-pulse mx-auto"></div>
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
<div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <AuthWrapper>
          <SubscriptionHandler onUsageCheck={handleUsageCheck} showProUpgradeIntent={showProUpgrade}>
            
            {/* Smart Alerts */}
            <SmartAlert userUsage={userUsage} />

            {/* Main Content */}
            <div className="space-y-8">
              
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
                <div className="space-y-8">
                  <SummaryDisplay summary={summary} />
                  <ActionHub onStartOver={handleStartOver} />
                  <CelebrationBanner userUsage={userUsage} />
                </div>
              )}
              
            </div>

          </SubscriptionHandler>
        </AuthWrapper>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            {/* Logo and Title */}
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg">🎯</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                MeetingMind
              </span>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              Transform your meetings into actionable insights with AI-powered summarization
            </p>
            
            {/* Feature badges */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚡</span>
                <span>Powered by OpenAI</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🚀</span>
                <span>Built with Next.js</span>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-400">
                © 2025 MeetingMind. Transforming conversations into clarity.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </Suspense>
    
  );
}