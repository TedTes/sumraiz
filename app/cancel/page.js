'use client';

import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import {Suspense} from 'react';
export default function CancelPage() {
  return (
    <Suspense fallback = {<div>Loading....</div>}>
       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        {/* Cancel Icon */}
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-gray-600" />
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-8">
          No worries! Your payment was cancelled and you haven't been charged. 
          You can try again anytime.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to App</span>
          </button>
        </div>
      </div>
    </div>
    </Suspense>
   
  );
}