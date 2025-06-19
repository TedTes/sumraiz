'use client';

import { Loader2, Mic, Brain, CheckCircle } from 'lucide-react';

export default function ProcessingStatus({ status, currentStep }) {
  const steps = [
    { id: 'uploading', label: 'Uploading file...', icon: Loader2 },
    { id: 'transcribing', label: 'Transcribing audio...', icon: Mic },
    { id: 'summarizing', label: 'Generating summary...', icon: Brain },
    { id: 'complete', label: 'Complete!', icon: CheckCircle }
  ];

  const getStepStatus = (stepId) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  if (status !== 'processing') return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-slide-in-down">
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-8 text-center">Processing uploaded file...</h3>
        
        <div className="space-y-4">
          {steps.slice(0, -1).map((step) => {
            const stepStatus = getStepStatus(step.id);
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center space-x-4">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-xl transition-smooth
                  ${stepStatus === 'complete' ? 'status-complete' : 
                    stepStatus === 'active' ? 'status-active' : 'status-pending'}
                `}>
                  {stepStatus === 'complete' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : stepStatus === 'active' ? (
                    <Icon className="h-5 w-5 text-primary-600 loading-spinner" />
                  ) : (
                    <Icon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                <span className={`
                  text-base font-medium transition-smooth
                  ${stepStatus === 'complete' ? 'text-green-700' : 
                    stepStatus === 'active' ? 'text-primary-700' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((steps.findIndex(s => s.id === currentStep) + 1) / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>
        
        <p className="text-sm text-gray-500 mt-6 text-center leading-relaxed">
          This usually takes 2-3 minutes depending on the length of your recording.
        </p>
      </div>
    </div>
  );
}