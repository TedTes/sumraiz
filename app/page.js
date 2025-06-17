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

// Enhanced Upload Zone with unified content type and compact summary style
const UnifiedUploadZone = ({ 
  onFileSelect, 
  onUrlSubmit, 
  isProcessing, 
  summaryLength, 
  setSummaryLength 
}) => {
  const [urlInput, setUrlInput] = useState('');
  
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUrlSubmit(urlInput.trim(), 'media'); // Single content type
      setUrlInput('');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
        
        {/* Left Sidebar - Summary Style Only */}
        <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 border-r border-blue-200">
          <div className="p-6 space-y-6">
            
            {/* Summary Style Selection - Compact Version */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-sm">⚙️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Summary Style</h3>
              </div>
              
              <div className="space-y-2">
                {[
                  { 
                    key: 'brief', 
                    label: 'Quick Brief', 
                    desc: '1-2 min read', 
                    icon: '⚡'
                  },
                  { 
                    key: 'medium', 
                    label: 'Balanced', 
                    desc: '3-4 min read', 
                    icon: '📊'
                  },
                  { 
                    key: 'detailed', 
                    label: 'Comprehensive', 
                    desc: '5+ min read', 
                    icon: '📖'
                  }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setSummaryLength(option.key)}
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
                      summaryLength === option.key
                        ? 'border-indigo-300 bg-white shadow-md'
                        : 'border-transparent bg-white/70 hover:bg-white/90'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        summaryLength === option.key 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className="text-sm">{option.icon}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-medium text-sm ${summaryLength === option.key ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                      {summaryLength === option.key && (
                        <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>


          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 relative">
          <div className="p-8 h-full flex flex-col">
            {/* URL Input */}
            <div className="mb-6">
              <form onSubmit={handleUrlSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste YouTube URL or media link (e.g., https://youtube.com/watch?v=...)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!urlInput.trim() || isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Process URL
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or upload file</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* File Upload */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full">
                <FileUpload 
                  onFileSelect={onFileSelect} 
                  isProcessing={isProcessing}
                  acceptedTypes={['MP3', 'M4A', 'WAV', 'WebM', 'MP4', 'MOV']}
                  placeholderText="Drop your audio or video file here"
                />
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
};
// Enhanced Processing Display with content-specific progress
const UnifiedProcessingDisplay = ({ processingStep, summaryLength, contentType }) => {
  const getProcessingMessages = () => {
    const messages = {
      meeting: {
        title: 'Processing Meeting Recording',
        steps: {
          uploading: 'Uploading audio file...',
          transcribing: 'Converting speech to text...',
          analyzing: 'Identifying speakers and topics...',
          extracting: 'Finding action items and decisions...',
          summarizing: 'Creating meeting summary...'
        }
      },
      video: {
        title: 'Processing Video Content',
        steps: {
          uploading: 'Processing video file...',
          transcribing: 'Extracting audio and transcription...',
          analyzing: 'Analyzing visual and audio cues...',
          extracting: 'Identifying key moments and timestamps...',
          summarizing: 'Creating video summary...'
        }
      },
      podcast: {
        title: 'Processing Podcast Episode',
        steps: {
          uploading: 'Loading podcast audio...',
          transcribing: 'Converting speech to text...',
          analyzing: 'Analyzing topics and themes...',
          extracting: 'Finding key insights and quotes...',
          summarizing: 'Creating episode summary...'
        }
      }
    };
    return messages[contentType] || messages.meeting;
  };

  const config = getProcessingMessages();

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{config.title}</h3>
                <p className="text-indigo-100">Creating your {summaryLength} summary...</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-white/90 text-sm">Estimated time</div>
              <div className="text-white font-bold text-lg">
                {contentType === 'video' ? '3-5 minutes' : '2-3 minutes'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <ProcessingStatus 
          status="processing" 
          currentStep={processingStep}
          customMessages={config.steps}
        />
        
        {/* Content-specific insights preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white">🎯</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">Smart Analysis</h4>
                <p className="text-sm text-blue-600">
                  {contentType === 'meeting' ? 'Identifying speakers and decisions' :
                   contentType === 'video' ? 'Detecting key moments and chapters' :
                   'Finding main topics and insights'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-blue-700">Analyzing content patterns...</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white">
                  {contentType === 'meeting' ? '📋' : contentType === 'video' ? '🎬' : '🎧'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-800">
                  {contentType === 'meeting' ? 'Action Items' :
                   contentType === 'video' ? 'Key Moments' : 'Episode Highlights'}
                </h4>
                <p className="text-sm text-emerald-600">
                  {contentType === 'meeting' ? 'Extracting tasks and follow-ups' :
                   contentType === 'video' ? 'Finding important timestamps' :
                   'Identifying main discussion points'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-emerald-700">Extracting actionable insights...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Action Hub with content-specific actions
const EnhancedActionHub = ({ onStartOver, summary, contentType }) => {
  const getActionConfig = () => {
    const configs = {
      meeting: {
        title: 'Meeting Actions',
        subtitle: 'Share insights and track follow-ups',
        primaryActions: [
          { icon: '📧', label: 'Email Summary', desc: 'Send to attendees', color: 'from-blue-400 to-blue-500' },
          { icon: '📋', label: 'Action Items', desc: 'Extract tasks', color: 'from-green-400 to-emerald-500' },
          { icon: '📅', label: 'Schedule Follow-up', desc: 'Book next meeting', color: 'from-purple-400 to-indigo-500' },
          { icon: '📊', label: 'Meeting Report', desc: 'Generate PDF', color: 'from-red-400 to-pink-500' }
        ],
        quickActions: [
          '📱 Send to Slack',
          '📝 Create Jira Tickets',
          '🔗 Share Link',
          '💬 AI Chat About Meeting'
        ]
      },
      video: {
        title: 'Video Actions',
        subtitle: 'Export insights and create clips',
        primaryActions: [
          { icon: '🎬', label: 'Key Moments', desc: 'Timestamp clips', color: 'from-red-400 to-pink-500' },
          { icon: '📝', label: 'Video Notes', desc: 'Study guide', color: 'from-blue-400 to-blue-500' },
          { icon: '📱', label: 'Social Clips', desc: 'Share highlights', color: 'from-purple-400 to-indigo-500' },
          { icon: '📄', label: 'Transcript', desc: 'Full text', color: 'from-green-400 to-emerald-500' }
        ],
        quickActions: [
          '🔗 Share Video Summary',
          '📚 Add to Learning Path',
          '✂️ Create Highlight Reel',
          '💬 Discuss with AI'
        ]
      },
      podcast: {
        title: 'Podcast Actions',
        subtitle: 'Save insights and create notes',
        primaryActions: [
          { icon: '🎧', label: 'Episode Notes', desc: 'Key takeaways', color: 'from-purple-400 to-indigo-500' },
          { icon: '💬', label: 'Quote Library', desc: 'Best quotes', color: 'from-blue-400 to-blue-500' },
          { icon: '📚', label: 'Learning Notes', desc: 'Study material', color: 'from-green-400 to-emerald-500' },
          { icon: '🔗', label: 'Episode Link', desc: 'Share summary', color: 'from-red-400 to-pink-500' }
        ],
        quickActions: [
          '📱 Save to Notion',
          '🎯 Topic Threading',
          '📖 Add to Reading List',
          '💬 Discuss Episode'
        ]
      }
    };
    return configs[contentType] || configs.meeting;
  };

  const config = getActionConfig();

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 border-b border-emerald-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🚀</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-800">{config.title}</h3>
              <p className="text-emerald-600">{config.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onStartOver} 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Process More Content
          </button>
        </div>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {config.primaryActions.map((action, index) => (
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
            {config.quickActions.map((action, index) => (
              <button 
                key={index}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Display Component
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

// Main Content Hub - Core MVP functionality only
function HomeContent() {
  const [activeTab, setActiveTab] = useState('meeting');
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

  // Redirect to landing page for non-authenticated users
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
      formData.append('contentType', activeTab);

      setProcessingStep('transcribing');
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process content');
      }

      setProcessingStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('extracting');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('summarizing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('complete');
      setSummary(result.summary);
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'An error occurred while processing your content');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = async (url, contentType) => {
    setError('');
    setSummary('');
    setIsProcessing(true);
    setProcessingStep('uploading');

    try {
      const response = await fetch('/api/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          contentType,
          summaryLength
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process URL');
      }

      setProcessingStep('transcribing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep('extracting');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('summarizing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('complete');
      setSummary(result.summary);
      
    } catch (err) {
      console.error('URL processing error:', err);
      setError(err.message || 'An error occurred while processing the URL');
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
                  <UnifiedUploadZone 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onFileSelect={handleFileSelect}
                    onUrlSubmit={handleUrlSubmit}
                    isProcessing={isProcessing}
                    summaryLength={summaryLength}
                    setSummaryLength={setSummaryLength}
                  />
                )}

                {/* Processing Display */}
                {isProcessing && (
                  <UnifiedProcessingDisplay 
                    processingStep={processingStep} 
                    summaryLength={summaryLength}
                    contentType={activeTab}
                  />
                )}

                {/* Error Display */}
                {error && (
                  <ErrorDisplay error={error} onRetry={handleStartOver} />
                )}

                {/* Summary Results */}
                {summary && (
                  <div className="space-y-12">
                    <SummaryDisplay summary={summary} contentType={activeTab} />
                    <EnhancedActionHub 
                      onStartOver={handleStartOver} 
                      summary={summary} 
                      contentType={activeTab}
                    />
                  </div>
                )}
                
              </div>

            </SubscriptionHandler>
          </AuthWrapper>
        </main>
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