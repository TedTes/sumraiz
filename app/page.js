'use client';

import { useState, useEffect, Suspense, createContext, useContext } from 'react';
import {FileConfirmationModal, LandingPage, SummaryDisplay,
  ProcessingStatus, SubscriptionHandler, AuthWrapper, URLinput,
  FileUpload, Header} from "../components";
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Target,
  Bot,
  Globe,
  FileText,
  ChevronDown,
  HelpCircle,
  Info
} from 'lucide-react';

// Configuration constants
const CONFIG = {
  models: [
    { 
      id: 'gpt-4', 
      name: 'GPT-4', 
      provider: 'OpenAI', 
      icon: '🤖', 
      description: 'Most capable model',
      badge: '🔥',
      badgeText: 'Best for general analysis',
      strengths: ['reasoning', 'comprehension', 'general tasks']
    },
    { 
      id: 'claude-3-sonnet', 
      name: 'Claude 3 Sonnet', 
      provider: 'Anthropic', 
      icon: '🧠', 
      description: 'Excellent reasoning',
      badge: '⚡',
      badgeText: 'Best for complex analysis',
      strengths: ['logical reasoning', 'detailed analysis', 'long content']
    },
    { 
      id: 'gemini-pro', 
      name: 'Gemini Pro', 
      provider: 'Google', 
      icon: '✨', 
      description: 'Great for analysis',
      badge: '📊',
      badgeText: 'Great for data analysis',
      strengths: ['data processing', 'multimodal content', 'technical docs']
    },
    { 
      id: 'llama-2-70b', 
      name: 'Llama 2 70B', 
      provider: 'Meta', 
      icon: '🦙', 
      description: 'Open source model',
      badge: '💡',
      badgeText: 'Alternative perspective',
      strengths: ['open source', 'privacy focused', 'different viewpoint']
    }
  ],
  
  fileTypes: ['MP3', 'M4A', 'WAV', 'WebM', 'MP4', 'MOV'],
  
  processingSteps: {
    UPLOADING: 'uploading',
    TRANSCRIBING: 'transcribing', 
    ANALYZING: 'analyzing',
    EXTRACTING: 'extracting',
    SUMMARIZING: 'summarizing',
    COMPLETE: 'complete'
  },

  analysisGoals: [
    { value: 'understanding', label: '🧠 Understanding', desc: 'Grasp key concepts and ideas' },
    { value: 'meeting-prep', label: '📅 Meeting Prep', desc: 'Prepare for discussions' },
    { value: 'content-creation', label: '✍️ Content Creation', desc: 'Generate derivative content' },
    { value: 'research', label: '🔍 Research', desc: 'Deep analysis and citations' },
    { value: 'fact-check', label: '✅ Fact Check', desc: 'Verify claims and accuracy' }
  ],

  analysisFocus: [
    { value: 'general', label: '🌍 General', desc: 'Balanced analysis' },
    { value: 'technical', label: '⚙️ Technical', desc: 'Focus on implementation' },
    { value: 'business', label: '💼 Business', desc: 'Strategic insights' },
    { value: 'educational', label: '🎓 Educational', desc: 'Learning concepts' }
  ]
};

// Settings Context
const SettingsContext = createContext();

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

const SettingsProvider = ({ children }) => {
  const [summaryLength, setSummaryLength] = useState('brief');
  const [selectedModels, setSelectedModels] = useState(['gpt-4']);
  const [smartSelectEnabled, setSmartSelectEnabled] = useState(true);
  const [analysisGoal, setAnalysisGoal] = useState('understanding');
  const [analysisFocus, setAnalysisFocus] = useState('general');

  const value = {
    summaryLength,
    setSummaryLength,
    selectedModels,
    setSelectedModels,
    smartSelectEnabled,
    setSmartSelectEnabled,
    analysisGoal,
    setAnalysisGoal,
    analysisFocus,
    setAnalysisFocus
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Smart Select Logic
const useSmartSelect = (contentType, analysisGoal) => {
  const getOptimalModels = (contentType, goal) => {
    const modelRecommendations = {
      'audio': {
        'understanding': ['gpt-4'],
        'meeting-prep': ['claude-3-sonnet'],
        'content-creation': ['gpt-4', 'claude-3-sonnet'],
        'research': ['claude-3-sonnet', 'gemini-pro'],
        'fact-check': ['gpt-4', 'gemini-pro']
      },
      'video': {
        'understanding': ['gemini-pro'],
        'meeting-prep': ['claude-3-sonnet'],
        'content-creation': ['gpt-4', 'gemini-pro'],
        'research': ['claude-3-sonnet'],
        'fact-check': ['gpt-4', 'gemini-pro']
      },
      'url': {
        'understanding': ['gpt-4'],
        'meeting-prep': ['claude-3-sonnet'],
        'content-creation': ['gpt-4'],
        'research': ['claude-3-sonnet', 'gemini-pro'],
        'fact-check': ['gemini-pro']
      }
    };

    return modelRecommendations[contentType]?.[goal] || ['gpt-4'];
  };

  const getExplanation = (contentType, goal, selectedModels) => {
    const explanations = {
      'gpt-4': 'excellent general understanding and reasoning',
      'claude-3-sonnet': 'superior at detailed analysis and long-form content',
      'gemini-pro': 'optimal for data analysis and multimodal content',
      'llama-2-70b': 'provides alternative perspective with privacy focus'
    };

    const reasons = selectedModels.map(model => explanations[model]).join(' and ');
    return `Selected ${selectedModels.join(', ')} for ${reasons} based on your ${goal} goal.`;
  };

  return { getOptimalModels, getExplanation };
};

// Individual Panel Components
const AnalysisGoalPanel = () => {
  const { analysisGoal, setAnalysisGoal } = useSettings();
  
  return (
    <div className="p-4 space-y-3">
      <h4 className="font-medium text-gray-800 text-sm flex items-center space-x-2">
        <Target className="h-4 w-4 text-emerald-600" />
        <span>🎯 What's your goal with this content?</span>
      </h4>
      {CONFIG.analysisGoals.map((goal) => (
        <button
          key={goal.value}
          onClick={() => setAnalysisGoal(goal.value)}
          className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
            analysisGoal === goal.value 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="font-medium">{goal.label}</div>
          <div className="text-xs text-gray-500 mt-1">{goal.desc}</div>
        </button>
      ))}
    </div>
  );
};

const OutputStylePanel = () => {
  const { summaryLength, setSummaryLength } = useSettings();
  
  return (
    <div className="p-4 space-y-3">
      <h4 className="font-medium text-gray-800 text-sm flex items-center space-x-2">
        <FileText className="h-4 w-4 text-blue-600" />
        <span>Output Style</span>
      </h4>
      
      <div className="space-y-2">
        <button
          onClick={() => setSummaryLength('brief')}
          className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
            summaryLength === 'brief' 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="font-medium">⚡ Quick Brief (1-2 min read)</div>
          <div className="text-xs text-gray-500 mt-1">Focus on key points and actionable insights</div>
        </button>

        <button
          onClick={() => setSummaryLength('medium')}
          className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
            summaryLength === 'medium' 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="font-medium">📊 Balanced (3-4 min read)</div>
          <div className="text-xs text-gray-500 mt-1">Balanced overview with important details</div>
        </button>

        <button
          onClick={() => setSummaryLength('detailed')}
          className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
            summaryLength === 'detailed' 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="font-medium">📖 Comprehensive (5+ min read)</div>
          <div className="text-xs text-gray-500 mt-1">Comprehensive analysis with deep insights</div>
        </button>
      </div>
    </div>
  );
};

const ModelsPanel = () => {
  const { selectedModels, setSelectedModels, smartSelectEnabled, setSmartSelectEnabled, analysisGoal } = useSettings();
  const { getExplanation } = useSmartSelect('audio', analysisGoal);
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800 text-sm flex items-center space-x-2">
          <Bot className="h-4 w-4 text-indigo-600" />
          <span>AI Models</span>
        </h4>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={smartSelectEnabled}
            onChange={(e) => setSmartSelectEnabled(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded"
          />
          <span className="text-xs text-gray-600">Smart Select</span>
        </label>
      </div>
      
      {smartSelectEnabled && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2 text-sm text-indigo-800">
            <span>🧠</span>
            <span className="font-medium">AI will choose optimal models for your content</span>
          </div>
          <div className="text-xs text-indigo-600 mt-1">
            {getExplanation('audio', analysisGoal, selectedModels)}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {CONFIG.models.map((model) => (
          <label
            key={model.id}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
              smartSelectEnabled ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedModels.includes(model.id)}
              disabled={smartSelectEnabled}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedModels(prev => [...prev, model.id]);
                } else {
                  setSelectedModels(prev => prev.filter(id => id !== model.id));
                }
              }}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <span className="text-lg">{model.icon}</span>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">{model.name}</span>
                <span className="text-xs">{model.badge}</span>
              </div>
              <div className="text-xs text-gray-500">{model.provider} • {model.badgeText}</div>
            </div>
          </label>
        ))}
      </div>
      
      {selectedModels.length === 0 && !smartSelectEnabled && (
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700 text-center">Please select at least one model</p>
        </div>
      )}
    </div>
  );
};

const AnalysisFocusPanel = () => {
  const { analysisFocus, setAnalysisFocus } = useSettings();
  
  return (
    <div className="p-4 space-y-3">
      <h4 className="font-medium text-gray-800 text-sm flex items-center space-x-2">
        <Globe className="h-4 w-4 text-purple-600" />
        <span>📊 Analysis Focus</span>
      </h4>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-600 font-medium">Focus Areas</div>
        {CONFIG.analysisFocus.map((focus) => (
          <button
            key={focus.value}
            onClick={() => setAnalysisFocus(focus.value)}
            className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
              analysisFocus === focus.value 
                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="font-medium">{focus.label}</div>
            <div className="text-xs text-gray-500">{focus.desc}</div>
          </button>
        ))}
      </div>

      <details className="mt-4">
        <summary className="text-xs text-gray-600 font-medium cursor-pointer hover:text-gray-800">
          Advanced Options ▼
        </summary>
        <div className="mt-2 space-y-2 pl-2">
          <button className="w-full text-left p-2 rounded text-xs text-gray-600 hover:bg-gray-100 border border-gray-200">
            ✍️ Custom Prompts
          </button>
          <button className="w-full text-left p-2 rounded text-xs text-gray-600 hover:bg-gray-100 border border-gray-200">
            ⚖️ Bias Detection
          </button>
          <button className="w-full text-left p-2 rounded text-xs text-gray-600 hover:bg-gray-100 border border-gray-200">
            🔍 Fact-checking Level
          </button>
        </div>
      </details>
    </div>
  );
};

// Quick Start Modal
const QuickStartModal = ({ isOpen, onClose, onApplySettings }) => {
  const [quickMode, setQuickMode] = useState('general');
  
  const quickModes = {
    general: {
      label: '🌟 General Analysis',
      description: 'Balanced settings for most content',
      settings: {
        summaryLength: 'medium',
        analysisGoal: 'understanding',
        analysisFocus: 'general',
        smartSelectEnabled: true
      }
    },
    meeting: {
      label: '📅 Meeting Focus',
      description: 'Optimized for meeting recordings',
      settings: {
        summaryLength: 'brief',
        analysisGoal: 'meeting-prep',
        analysisFocus: 'business',
        smartSelectEnabled: true
      }
    },
    research: {
      label: '🔍 Research Mode',
      description: 'Detailed analysis with citations',
      settings: {
        summaryLength: 'detailed',
        analysisGoal: 'research',
        analysisFocus: 'technical',
        smartSelectEnabled: true
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">🚀 Quick Start</h3>
        <p className="text-gray-600 mb-6">Choose a preset to get started quickly:</p>
        
        <div className="space-y-3 mb-6">
          {Object.entries(quickModes).map(([key, mode]) => (
            <label key={key} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={key}
                checked={quickMode === key}
                onChange={(e) => setQuickMode(e.target.value)}
                className="mt-1"
              />
              <div>
                <div className="font-medium">{mode.label}</div>
                <div className="text-sm text-gray-500">{mode.description}</div>
              </div>
            </label>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => {
              onApplySettings(quickModes[quickMode].settings);
              onClose();
            }}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Apply Settings
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Manual Setup
          </button>
        </div>
      </div>
    </div>
  );
};

// Floating Settings Bar
const FloatingSettingsBar = ({ sidebarCollapsed = false }) => {
  const [activePanel, setActivePanel] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { selectedModels, smartSelectEnabled, summaryLength, analysisGoal, analysisFocus } = useSettings();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const settingsButtons = [
    {
      id: 'goal',
      icon: Target,
      color: 'emerald',
      title: 'Analysis Goal',
      current: CONFIG.analysisGoals.find(g => g.value === analysisGoal)?.label || 'Understanding'
    },
    {
      id: 'output',
      icon: FileText,
      color: 'blue',
      title: 'Output Style',
      current: summaryLength === 'brief' ? 'Quick Brief' : 
               summaryLength === 'medium' ? 'Balanced' : 'Comprehensive'
    },
    {
      id: 'models',
      icon: Bot,
      color: 'indigo',
      title: 'AI Models',
      current: smartSelectEnabled ? 'Smart Select' : `${selectedModels.length} selected`
    },
    {
      id: 'focus',
      icon: Globe,
      color: 'purple',
      title: 'Analysis Focus',
      current: CONFIG.analysisFocus.find(f => f.value === analysisFocus)?.label || 'General'
    }
  ];

  const renderTooltip = () => {
    if (!hoveredButton || isMobile) return null;
    
    const button = settingsButtons.find(b => b.id === hoveredButton);
    if (!button) return null;

    const buttonIndex = settingsButtons.findIndex(b => b.id === hoveredButton);
    const baseTop = 132;
    const buttonSpacing = 60;
    const tooltipTop = baseTop + (buttonIndex * buttonSpacing);

    return (
      <div 
        className="fixed z-50 pointer-events-none"
        style={{
          left: '80px',
          top: `${tooltipTop}px`
        }}
      >
        <div className="relative bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
            <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
          <div className="font-semibold">{button.title}</div>
          <div className="text-gray-300 text-xs mt-1">{button.current}</div>
        </div>
      </div>
    );
  };

  const shouldShowFloatingBar = isMobile || sidebarCollapsed;

  if (!shouldShowFloatingBar) return null;

  return (
    <>
      {isMobile ? (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-4">
            <button
              onClick={() => setActivePanel(activePanel ? null : 'settings')}
              className="w-full flex items-center justify-center space-x-2 text-indigo-600 font-medium"
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed left-4 top-32 z-40">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-2 space-y-3">
            {settingsButtons.map((button) => {
              const IconComponent = button.icon;
              const isActive = activePanel === button.id;
              
              return (
                <button
                  key={button.id}
                  onClick={() => setActivePanel(isActive ? null : button.id)}
                  onMouseEnter={() => setHoveredButton(button.id)}
                  onMouseLeave={() => setHoveredButton(null)}
                  className={`
                    relative w-12 h-12 rounded-xl flex items-center justify-center 
                    transition-all duration-300 hover:scale-110 group
                    ${isActive 
                      ? `bg-${button.color}-500 shadow-lg` 
                      : `bg-${button.color}-100 hover:bg-${button.color}-200`
                    }
                  `}
                  title={button.title}
                  aria-label={`${button.title}: ${button.current}`}
                >
                  <IconComponent 
                    className={`h-5 w-5 transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : `text-${button.color}-600`
                    }`} 
                  />
                  
                  {button.id === 'models' && smartSelectEnabled && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🧠</span>
                    </div>
                  )}
                  
                  {button.id === 'models' && !smartSelectEnabled && selectedModels.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{selectedModels.length}</span>
                    </div>
                  )}
                  
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activePanel && (
        <div className={`fixed z-50 ${
          isMobile 
            ? 'inset-0 bg-white' 
            : 'left-20 top-32'
        }`}>
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {settingsButtons.find(b => b.id === activePanel)?.title || 'Settings'}
              </h3>
              <button
                onClick={() => setActivePanel(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className={`${isMobile ? 'p-4 overflow-y-auto h-full' : 'bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 w-72 max-h-80 overflow-y-auto'}`}>
            {activePanel === 'goal' && <AnalysisGoalPanel />}
            {activePanel === 'output' && <OutputStylePanel />}
            {activePanel === 'models' && <ModelsPanel />}
            {activePanel === 'focus' && <AnalysisFocusPanel />}
          </div>
        </div>
      )}

      {!activePanel && !isMobile && renderTooltip()}

      {activePanel && !isMobile && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setActivePanel(null)}
        />
      )}
    </>
  );
};

// Collapsible Sidebar
const CollapsibleSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { summaryLength, setSummaryLength, selectedModels, setSelectedModels, 
          smartSelectEnabled, setSmartSelectEnabled, analysisGoal, setAnalysisGoal, 
          analysisFocus, setAnalysisFocus } = useSettings();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <div className={`hidden lg:block transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    } flex-shrink-0`}>
      <div className="h-full bg-white border-r border-gray-200 shadow-sm">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-800">Settings</h3>
                </div>
              )}
              
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
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isCollapsed ? (
              <div className="space-y-3">
                {[Target, FileText, Bot, Globe].map((Icon, index) => (
                  <div key={index} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <AnalysisGoalPanel />
                <OutputStylePanel />
                <ModelsPanel />
                <AnalysisFocusPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress component
const RealTimeProgress = ({ currentStep, progress = 0 }) => {
  const steps = [
    { key: CONFIG.processingSteps.UPLOADING, label: 'Uploading', icon: '📤' },
    { key: CONFIG.processingSteps.TRANSCRIBING, label: 'Transcribing', icon: '🎯' },
    { key: CONFIG.processingSteps.ANALYZING, label: 'Analyzing', icon: '🧠' },
    { key: CONFIG.processingSteps.EXTRACTING, label: 'Extracting', icon: '💎' },
    { key: CONFIG.processingSteps.SUMMARIZING, label: 'Summarizing', icon: '📝' },
    { key: CONFIG.processingSteps.COMPLETE, label: 'Complete', icon: '✅' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Processing Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {steps.map((step, index) => (
          <div 
            key={step.key}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
              index <= currentStepIndex 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            <span className="text-lg">{step.icon}</span>
            <span className="text-sm font-medium">{step.label}</span>
            {index === currentStepIndex && (
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced MediaInputPanel
const MediaInputPanel = ({ 
  onFileSelect, 
  onUrlSubmit, 
  isProcessing
}) => {
  const { selectedModels, summaryLength, smartSelectEnabled } = useSettings();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);

  const handleFileSelect = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('File too large. Please upload files smaller than 100MB.');
      return;
    }

    const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/webm', 'video/mp4', 'video/mov'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|m4a|wav|webm|mp4|mov)$/i)) {
      alert('Invalid file type. Please upload MP3, M4A, WAV, WebM, MP4, or MOV files.');
      return;
    }

    setPendingFile(file);
    setShowConfirmModal(true);
  };

  const handleConfirmProcessing = () => {
    if (pendingFile) {
      setShowConfirmModal(false);
      onFileSelect(pendingFile);
      setPendingFile(null);
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    setPendingFile(null);
    setFileKey(prev => prev + 1);
  };

  const effectiveModels = smartSelectEnabled ? ['AI-Selected'] : selectedModels;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Upload Media Content</h2>
              <p className="text-gray-600">Transform audio & video into actionable insights</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></span>
              <span>{effectiveModels.length} AI Model{effectiveModels.length !== 1 ? 's' : ''} Selected</span>
            </div>
          </div>
        </div>

        <URLinput 
          isProcessing={isProcessing} 
          selectedModels={effectiveModels}   
          onUrlSubmit={onUrlSubmit}
        />

        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or upload file</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="flex-1 flex items-center justify-center mb-6">
          <div className="w-full">
            <FileUpload 
              key={fileKey}
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
              acceptedTypes={CONFIG.fileTypes}
              placeholderText="Drop your audio or video file here"
            />
            {(!smartSelectEnabled && selectedModels.length === 0) && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg" role="alert">
                <p className="text-amber-700 text-sm text-center">
                  ⚠️ Please configure your settings to proceed
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0 text-sm text-gray-600 bg-blue-50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500" aria-hidden="true">💡</span>
            <span><strong>Pro tip:</strong> 10-180 min content works best</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500" aria-hidden="true">🎯</span>
            <span>Supports {CONFIG.fileTypes.join(', ')} + YouTube URLs</span>
          </div>
        </div>
      </div>

      <FileConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelModal}
        onConfirm={handleConfirmProcessing}
        file={pendingFile}
        selectedModels={effectiveModels}
        summaryLength={summaryLength}
      />
    </div>
  );
};

// Processing Display
const InputProcessingDisplay = ({ processingStep, progress = 0 }) => {
  const { selectedModels, summaryLength, smartSelectEnabled } = useSettings();
  
  const effectiveModels = smartSelectEnabled ? ['AI-Selected'] : selectedModels;
  const estimatedTime = effectiveModels.length > 1 ? '3-5 minutes' : '2-3 minutes';

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Processing Content</h3>
                <p className="text-indigo-100">
                  {effectiveModels.length} Model{effectiveModels.length > 1 ? 's' : ''} • {summaryLength} summary
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-white/90 text-sm">Estimated time</div>
              <div className="text-white font-bold text-lg">{estimatedTime}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <RealTimeProgress currentStep={processingStep} progress={progress} />
      </div>
    </div>
  );
};

// Retry Logic Hook
const useRetryLogic = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = async (fn, maxRetries = 3) => {
    setIsRetrying(true);
    let lastError;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await fn();
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        lastError = error;
        setRetryCount(i + 1);

        if (i < maxRetries) {
          const delay = Math.pow(2, i) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    setIsRetrying(false);
    throw lastError;
  };

  return { retry, retryCount, isRetrying };
};

// Enhanced Error Display
const ErrorDisplay = ({ error, onRetry, onContactSupport }) => {
  const getErrorSuggestion = (error) => {
    if (error.includes('file size') || error.includes('100MB')) {
      return "Try compressing your file or splitting it into smaller segments.";
    }
    if (error.includes('Invalid') && error.includes('URL')) {
      return "Please check the URL format and ensure it's a valid YouTube or media link.";
    }
    if (error.includes('rate limit') || error.includes('quota')) {
      return "Our servers are busy. Please wait a few minutes before trying again.";
    }
    if (error.includes('network') || error.includes('connection')) {
      return "Check your internet connection and try again.";
    }
    return "This appears to be a temporary issue. Please try again.";
  };

  return (
    <div className="bg-white rounded-3xl border border-red-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 border-b border-red-100">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
            <span className="text-red-600 text-2xl" role="img" aria-label="Warning">⚠️</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-800">Processing Failed</h3>
            <p className="text-red-600">Don't worry, let's fix this together</p>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <p className="text-red-700 font-medium mb-2">{error}</p>
          <p className="text-red-600 text-sm">{getErrorSuggestion(error)}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRetry}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200"
            aria-label="Retry processing"
          >
            Try Again
          </button>
          <button 
            onClick={onContactSupport}
            className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
            aria-label="Contact support team"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Content Hub
function HomeContent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [summaries, setSummaries] = useState({});
  const [contentTranscript, setContentTranscript] = useState('');
  const [error, setError] = useState('');
  const [userUsage, setUserUsage] = useState(null);
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [showStarterUpgrade, setShowStarterUpgrade] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);

  const { selectedModels, summaryLength, smartSelectEnabled, setSummaryLength, setAnalysisGoal, setAnalysisFocus, setSmartSelectEnabled } = useSettings();
  const { retry, retryCount, isRetrying } = useRetryLogic();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const hasSeenQuickStart = localStorage?.getItem('hasSeenQuickStart');
    if (!hasSeenQuickStart && isSignedIn) {
      setShowQuickStart(true);
    }
  }, [isSignedIn]);

  useEffect(() => {
    const intent = searchParams.get('intent');
    if (intent === 'pro') {
      setShowProUpgrade(true);
      setShowStarterUpgrade(false);
    } else if (intent === 'starter') {
      setShowStarterUpgrade(true);
      setShowProUpgrade(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isProcessing) return;

    const progressIntervals = {
      [CONFIG.processingSteps.UPLOADING]: { start: 0, end: 20 },
      [CONFIG.processingSteps.TRANSCRIBING]: { start: 20, end: 50 },
      [CONFIG.processingSteps.ANALYZING]: { start: 50, end: 70 },
      [CONFIG.processingSteps.EXTRACTING]: { start: 70, end: 85 },
      [CONFIG.processingSteps.SUMMARIZING]: { start: 85, end: 95 },
      [CONFIG.processingSteps.COMPLETE]: { start: 95, end: 100 }
    };

    const interval = progressIntervals[processingStep];
    if (!interval) return;

    const duration = 2000;
    const steps = 20;
    const increment = (interval.end - interval.start) / steps;
    let currentProgress = interval.start;

    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= interval.end) {
        setProcessingProgress(interval.end);
        clearInterval(timer);
      } else {
        setProcessingProgress(currentProgress);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [processingStep, isProcessing]);

  const handleQuickStartApply = (settings) => {
    localStorage?.setItem('hasSeenQuickStart', 'true');
    setSummaryLength(settings.summaryLength);
    setAnalysisGoal(settings.analysisGoal);
    setAnalysisFocus(settings.analysisFocus);
    setSmartSelectEnabled(settings.smartSelectEnabled);
    setShowQuickStart(false);
  };

  const handleUsageCheck = (usage) => {
    setUserUsage(usage);
  };

  const processFile = async (file) => {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('summaryLength', summaryLength);
    formData.append('selectedModels', JSON.stringify(smartSelectEnabled ? ['smart-select'] : selectedModels));

    const response = await fetch('/api/summarize/audio-summarize', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to process content');
    }

    return response.json();
  };

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setError('');
    setSummaries({});
    setContentTranscript('');
    setIsProcessing(true);
    setProcessingStep(CONFIG.processingSteps.UPLOADING);
    setProcessingProgress(0);

    try {
      setProcessingStep(CONFIG.processingSteps.TRANSCRIBING);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep(CONFIG.processingSteps.ANALYZING);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep(CONFIG.processingSteps.EXTRACTING);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep(CONFIG.processingSteps.SUMMARIZING);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await retry(() => processFile(file));
      
      setProcessingStep(CONFIG.processingSteps.COMPLETE);
      setProcessingProgress(100);
      
      setSummaries(result.summaries);
      setContentTranscript(result.transcript);
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'An error occurred while processing your content');
    } finally {
      setIsProcessing(false);
    }
  };

  const processUrl = async (url, type) => {
    const response = await fetch('/api/summarize/url-summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        type,
        summaryLength,
        selectedModels: smartSelectEnabled ? ['smart-select'] : selectedModels
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to process URL');
    }

    return response.json();
  };

  const handleUrlSubmit = async (url, type) => {
    setError('');
    setSummaries({});
    setContentTranscript('');
    setIsProcessing(true);
    setProcessingStep(CONFIG.processingSteps.UPLOADING);
    setProcessingProgress(0);

    try {
      setProcessingStep(CONFIG.processingSteps.TRANSCRIBING);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep(CONFIG.processingSteps.ANALYZING);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep(CONFIG.processingSteps.EXTRACTING);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep(CONFIG.processingSteps.SUMMARIZING);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await retry(() => processUrl(url, type));
      
      setProcessingStep(CONFIG.processingSteps.COMPLETE);
      setProcessingProgress(100);
      
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
    setProcessingProgress(0);
    setSummaries({});
    setContentTranscript('');
    setError('');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@example.com?subject=Processing Error&body=' + encodeURIComponent(error), '_blank');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl animate-pulse">
            <span className="text-white text-3xl" aria-hidden="true">🎯</span>
          </div>
          <div className="space-y-3">
            <div className="w-40 h-4 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
            <div className="w-32 h-3 bg-gray-100 rounded-full animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <LandingPage />;
  }

  const hasSummaries = summaries && Object.keys(summaries).length > 0;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        
        <AuthWrapper>
          <SubscriptionHandler 
            onUsageCheck={handleUsageCheck} 
            showProUpgradeIntent={showProUpgrade}  
            showStarterUpgradeIntent={showStarterUpgrade}
          >
            <FloatingSettingsBar sidebarCollapsed={sidebarCollapsed} />
            
            <div className="flex h-[calc(100vh-80px)]">
              <CollapsibleSidebar
                isCollapsed={sidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed}
              />

              <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-6 py-12">
                  <div className="space-y-12">
                    
                    {!hasSummaries && !isProcessing && (
                      <MediaInputPanel 
                        onFileSelect={handleFileSelect}
                        onUrlSubmit={handleUrlSubmit}
                        isProcessing={isProcessing}
                      />
                    )}

                    {isProcessing && (
                      <InputProcessingDisplay 
                        processingStep={processingStep} 
                        progress={processingProgress}
                      />
                    )}

                    {error && (
                      <ErrorDisplay 
                        error={error} 
                        onRetry={handleStartOver}
                        onContactSupport={handleContactSupport}
                      />
                    )}

                    {hasSummaries && (
                      <>
                        <SummaryDisplay 
                          summaries={summaries}
                          selectedModels={smartSelectEnabled ? ['AI-Selected'] : selectedModels}
                          transcript={contentTranscript}
                        />
                        
                        <div className="flex justify-center">
                          <button 
                            onClick={handleStartOver} 
                            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            aria-label="Start new analysis"
                          >
                            🔄 Start New Analysis
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <QuickStartModal
              isOpen={showQuickStart}
              onClose={() => {
                localStorage?.setItem('hasSeenQuickStart', 'true');
                setShowQuickStart(false);
              }}
              onApplySettings={handleQuickStartApply}
            />
          </SubscriptionHandler>
        </AuthWrapper>
      </div>
    </Suspense>
  );
}

export default function Home() {
  return (
    <SettingsProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </SettingsProvider>
  );
}