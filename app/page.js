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
import { 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  Target,
  Bot,
  Globe,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const CollapsibleSidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen,
  summaryLength, 
  setSummaryLength,
  selectedModels,
  setSelectedModels,
  analysisMode,
  setAnalysisMode 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile overlay handler
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-800">Settings</h3>
            </div>
          )}
          
          {/* Desktop collapse button */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}
          
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        <div className="p-4 space-y-6">
          
          {/* Current Settings Summary - Collapsed State */}
          {isCollapsed && !isMobile && (
            <div className="space-y-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 hover:scale-110 hover:bg-emerald-200" title="Output Style">
                <Target className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 hover:scale-110 hover:bg-indigo-200" title="AI Model">
                <Bot className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 hover:scale-110 hover:bg-blue-200" title="Language">
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 hover:scale-110 hover:bg-purple-200" title="Export Format">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          )}

          {/* Full Settings - Expanded State */}
          {!isCollapsed && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Output Style */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-emerald-200">
                    <Target className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h4 className="font-medium text-gray-800">Output Style</h4>
                </div>
                
                <select 
                  value={summaryLength}
                  onChange={(e) => setSummaryLength(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-emerald-50/50 transition-all duration-200 hover:bg-emerald-50"
                >
                  <option value="brief">⚡ Quick Brief (1-2 min read)</option>
                  <option value="medium">📊 Balanced (3-4 min read)</option>
                  <option value="detailed">📖 Comprehensive (5+ min read)</option>
                </select>
              </div>

              {/* AI Model */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                <button
                  onClick={() => setShowModelSelection(!showModelSelection)}
                  className="w-full flex items-center justify-between mb-3 transition-all duration-200 hover:bg-gray-50 rounded-lg p-2 -m-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-indigo-200">
                      <Bot className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">Select Models</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${showModelSelection ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Show selected models count when collapsed */}
                {!showModelSelection && (
                  <div className="text-sm text-indigo-600 font-medium transition-all duration-300">
                    {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''} selected
                    {selectedModels.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedModels.map(id => {
                          const modelNames = {
                            'gpt-4': 'GPT-4',
                            'claude-3-sonnet': 'Claude 3',
                            'gemini-pro': 'Gemini Pro',
                            'llama-2-70b': 'Llama 2'
                          };
                          return modelNames[id] || id;
                        }).join(', ')}
                      </div>
                    )}
                  </div>
                )}
                
                {showModelSelection && (
                  <div className="space-y-3 animate-slide-in-down">
                    {[
                      { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', icon: '🤖', description: 'Most capable model' },
                      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', icon: '🧠', description: 'Excellent reasoning' },
                      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', icon: '✨', description: 'Great for analysis' },
                      { id: 'llama-2-70b', name: 'Llama 2 70B', provider: 'Meta', icon: '🦙', description: 'Open source model' }
                    ].map((model) => (
                      <label
                        key={model.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedModels.includes(model.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedModels(prev => [...prev, model.id]);
                            } else {
                              setSelectedModels(prev => prev.filter(id => id !== model.id));
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 transition-all duration-200"
                        />
                        <span className="text-lg transition-transform duration-200 hover:scale-110">{model.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">{model.name}</div>
                          <div className="text-xs text-gray-500">{model.provider} • {model.description}</div>
                        </div>
                      </label>
                    ))}
                    
                    {selectedModels.length === 0 && (
                      <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in-up">
                        <p className="text-xs text-amber-700 text-center">Please select at least one model</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Language */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-blue-200">
                    <Globe className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-800">Language</h4>
                </div>
                <select className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 transition-all duration-200 hover:bg-blue-50">
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Spanish</option>
                  <option value="fr">🇫🇷 French</option>
                  <option value="de">🇩🇪 German</option>
                  <option value="zh">🇨🇳 Chinese</option>
                  <option value="ja">🇯🇵 Japanese</option>
                </select>
              </div>

              {/* Export Format */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between mb-3 transition-all duration-200 hover:bg-gray-50 rounded-lg p-2 -m-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-purple-200">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-800">Export Format</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
                
                {!showAdvanced && (
                  <div className="text-sm text-purple-600 font-medium transition-all duration-300">PDF Document</div>
                )}
                
                {showAdvanced && (
                  <div className="space-y-3 animate-slide-in-down">
                    <select className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/50 transition-all duration-200 hover:bg-purple-50">
                      <option value="pdf">📄 PDF Document</option>
                      <option value="word">📝 Word Document</option>
                      <option value="text">📋 Plain Text</option>
                      <option value="email">📧 Email Template</option>
                      <option value="markdown">📋 Markdown</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile version (overlay)
  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
            <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl">
              {sidebarContent}
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop version
  return (
    <div className={`hidden lg:block transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    } flex-shrink-0`}>
      <div className="h-full bg-white border-r border-gray-200 shadow-sm">
        {sidebarContent}
      </div>
    </div>
  );
};

//  Upload Zone with sidebar integration
const UnifiedUploadZone = ({ 
  onFileSelect, 
  onUrlSubmit, 
  isProcessing, 
  summaryLength, 
  setSummaryLength,
  selectedModels,
  setSelectedModels,
  analysisMode,
  setAnalysisMode
}) => {
  const [urlInput, setUrlInput] = useState('');

  const handleUrlSubmit = () => {
    if (urlInput.trim() && selectedModels.length > 0) {
      onUrlSubmit(urlInput.trim(), 'media');
      setUrlInput('');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Upload Media Content</h2>
              <p className="text-gray-600">Transform audio & video into actionable insights</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>{selectedModels.length} AI Model{selectedModels.length !== 1 ? 's' : ''} Selected</span>
            </div>
          </div>
        </div>

        {/* URL Input */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste YouTube URL or media link..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && urlInput.trim() && !isProcessing && selectedModels.length > 0) {
                    handleUrlSubmit();
                  }
                }}
              />
            </div>
            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim() || isProcessing || selectedModels.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                'Process URL'
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or upload file</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* File Upload */}
        <div className="flex-1 flex items-center justify-center mb-6">
          <div className="w-full">
            <FileUpload 
              onFileSelect={onFileSelect} 
              isProcessing={isProcessing}
              acceptedTypes={['MP3', 'M4A', 'WAV', 'WebM', 'MP4', 'MOV']}
              placeholderText="Drop your audio or video file here"
            />
            {selectedModels.length === 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-700 text-sm text-center">
                  ⚠️ Please configure your settings in the sidebar to proceed
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pro Tips Bar - Moved to bottom */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 bg-blue-50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">💡</span>
            <span><strong>Pro tip:</strong> 10-180 min content works best</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">🎯</span>
            <span>Supports MP3, M4A, WAV, MP4, WebM + YouTube URLs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

//  Processing Display
const UnifiedProcessingDisplay = ({ processingStep, summaryLength, contentType, selectedModels, analysisMode }) => {
  const getProcessingMessages = () => {
    const baseMessages = {
      uploading: 'Uploading and processing media file...',
      transcribing: 'Converting speech to text...',
      analyzing: `Analyzing with ${selectedModels.length} AI model${selectedModels.length > 1 ? 's' : ''}...`,
      extracting: 'Extracting key insights and patterns...',
      summarizing: analysisMode === 'consensus' 
        ? 'Creating AI consensus summary...' 
        : `Generating ${summaryLength} summary...`,
      consensus: 'Comparing and merging AI perspectives...',
      complete: 'Analysis complete!'
    };
    return baseMessages;
  };

  const messages = getProcessingMessages();

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
                <h3 className="text-2xl font-bold text-white">Processing Content</h3>
                <p className="text-indigo-100">
                  {analysisMode === 'consensus' ? 'AI Consensus Mode' : `${selectedModels.length} Model${selectedModels.length > 1 ? 's' : ''}`} • {summaryLength} summary
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-white/90 text-sm">Estimated time</div>
              <div className="text-white font-bold text-lg">
                {analysisMode === 'consensus' ? '4-6 minutes' : 
                 selectedModels.length > 1 ? '3-5 minutes' : '2-3 minutes'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <ProcessingStatus 
          status="processing" 
          currentStep={processingStep}
          customMessages={messages}
        />
      </div>
    </div>
  );
};

// Main Content Hub with sidebar integration
function HomeContent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [summaries, setSummaries] = useState({});
  const [contentTranscript, setContentTranscript] = useState('');
  const [error, setError] = useState('');
  const [userUsage, setUserUsage] = useState(null);
  const [summaryLength, setSummaryLength] = useState('brief');
  const [selectedModels, setSelectedModels] = useState(['gpt-4']);
  const [analysisMode, setAnalysisMode] = useState('single');
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const searchParams = useSearchParams();
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
    setSummaries({});
    setContentTranscript('');
    setIsProcessing(true);
    setProcessingStep('uploading');

    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('summaryLength', summaryLength);
      formData.append('selectedModels', JSON.stringify(selectedModels));
      formData.append('analysisMode', analysisMode);

      setProcessingStep('transcribing');
      
      const response = await fetch('/api/-summarize', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process content');
      }

      setProcessingStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep('extracting');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (analysisMode === 'consensus') {
        setProcessingStep('consensus');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setProcessingStep('summarizing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('complete');
      setSummaries(result.summaries);
      setContentTranscript(result.transcript);
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'An error occurred while processing your content');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = async (url, type) => {
    setError('');
    setSummaries({});
    setContentTranscript('');
    setIsProcessing(true);
    setProcessingStep('uploading');

    try {
      const response = await fetch('/api/-process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          type,
          summaryLength,
          selectedModels,
          analysisMode
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
      
      if (analysisMode === 'consensus') {
        setProcessingStep('consensus');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setProcessingStep('summarizing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('complete');
      setSummaries(result.summaries);
      setContentTranscript(result.transcript);
      
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
    setSummaries({});
    setContentTranscript('');
    setError('');
  };

  const hasSummaries = Object.keys(summaries).length > 0;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        
        <AuthWrapper>
          <SubscriptionHandler onUsageCheck={handleUsageCheck} showProUpgradeIntent={showProUpgrade}>
            
            <div className="flex h-[calc(100vh-80px)]">
              {/* Mobile Settings Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden fixed top-20 right-4 z-40 bg-indigo-500 text-white p-3 rounded-xl shadow-lg hover:bg-indigo-600 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Sidebar */}
              <CollapsibleSidebar
                isCollapsed={sidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed}
                isMobileOpen={mobileSidebarOpen}
                setIsMobileOpen={setMobileSidebarOpen}
                summaryLength={summaryLength}
                setSummaryLength={setSummaryLength}
                selectedModels={selectedModels}
                setSelectedModels={setSelectedModels}
                analysisMode={analysisMode}
                setAnalysisMode={setAnalysisMode}
              />

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-6 py-12">
                  <div className="space-y-12">
                    
                    {/* Upload Interface */}
                    {!hasSummaries && !isProcessing && (
                      <UnifiedUploadZone 
                        onFileSelect={handleFileSelect}
                        onUrlSubmit={handleUrlSubmit}
                        isProcessing={isProcessing}
                        summaryLength={summaryLength}
                        setSummaryLength={setSummaryLength}
                        selectedModels={selectedModels}
                        setSelectedModels={setSelectedModels}
                        analysisMode={analysisMode}
                        setAnalysisMode={setAnalysisMode}
                      />
                    )}

                    {/* Processing Display */}
                    {isProcessing && (
                      <UnifiedProcessingDisplay 
                        processingStep={processingStep} 
                        summaryLength={summaryLength}
                        contentType="media"
                        selectedModels={selectedModels}
                        analysisMode={analysisMode}
                      />
                    )}

                    {/* Error Display */}
                    {error && (
                      <ErrorDisplay error={error} onRetry={handleStartOver} />
                    )}

                    {/* Summary Results */}
                    {hasSummaries && (
                      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-100">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-xl">📄</span>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-emerald-800">
                                  {analysisMode === 'consensus' ? 'AI Consensus Summary' : 'Analysis Complete'}
                                </h3>
                                <p className="text-emerald-600">
                                  {analysisMode === 'consensus' 
                                    ? 'Best insights from multiple AI models'
                                    : `Generated using ${selectedModels.length} AI model${selectedModels.length > 1 ? 's' : ''}`
                                  }
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={handleStartOver} 
                              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
                            >
                              New Analysis
                            </button>
                          </div>
                        </div>

                        {/* Summary Content */}
                        <div className="p-6">
                          <div className="prose prose-lg max-w-none">
                            {analysisMode === 'consensus' ? (
                              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
                                <div className="flex items-center space-x-3 mb-4">
                                  <span className="text-2xl">🌟</span>
                                  <h4 className="text-lg font-bold text-purple-800">AI Consensus Summary</h4>
                                </div>
                                <p className="text-purple-700 text-sm mb-4">
                                  This summary represents the best insights and analysis from multiple AI models.
                                </p>
                                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                  {summaries.consensus || 'Generating consensus summary...'}
                                </div>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                {summaries[selectedModels[0]] || 'Generating summary...'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            </div>

          </SubscriptionHandler>
        </AuthWrapper>
      </div>
    </Suspense>
  );
}

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

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}