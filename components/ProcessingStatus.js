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
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Processing your meeting...</h3>
        
        <div className="space-y-4">
          {steps.slice(0, -1).map((step) => {
            const stepStatus = getStepStatus(step.id);
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center space-x-3">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full
                  ${stepStatus === 'complete' ? 'bg-green-100' : 
                    stepStatus === 'active' ? 'bg-primary-100' : 'bg-gray-100'}
                `}>
                  {stepStatus === 'complete' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : stepStatus === 'active' ? (
                    <Icon className="h-4 w-4 text-primary-600 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                
                <span className={`
                  ${stepStatus === 'complete' ? 'text-green-700 font-medium' : 
                    stepStatus === 'active' ? 'text-primary-700 font-medium' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${((steps.findIndex(s => s.id === currentStep) + 1) / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          This usually takes 2-3 minutes depending on the length of your recording.
        </p>
      </div>
    </div>
  );
}