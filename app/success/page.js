'use client';

import { useEffect, useState,Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Crown, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optional: Verify the session with  backend
    if (sessionId) {
      // TODO: ???call an API to verify the payment
      setTimeout(() => setLoading(false), 2000); // Simulate loading
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your upgrade...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback = {<div>Loading....</div>}>
<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        {/* Success Icon */}
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Welcome to Pro!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was successful! You now have unlimited access to MeetingMind Pro features.
        </p>

        {/* Features unlocked */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-center">
            <Crown className="h-5 w-5 text-yellow-500 mr-2" />
            Features Unlocked
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✅ Unlimited meeting summaries</li>
            <li>✅ Priority processing</li>
            <li>✅ Advanced exports</li>
            <li>✅ Priority support</li>
          </ul>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => window.location.href = '/?upgraded=true'}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Start Using Pro Features</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Session ID for debugging */}
        {sessionId && (
          <p className="text-xs text-gray-400 mt-4">
            Session: {sessionId.slice(0, 8)}...
          </p>
        )}
      </div>
    </div>
    </Suspense>
    
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}