'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Crown, Zap, AlertCircle } from 'lucide-react';

export default function SubscriptionHandler({ children, onUsageCheck }) {
  const { user } = useUser();
  const [usage, setUsage] = useState({ count: 0, limit: 3, plan: 'free' });
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserUsage();
    }
  }, [user]);

  const checkUserUsage = async () => {
    try {
      const response = await fetch('/api/user/usage');
      const data = await response.json();
      setUsage(data);
      
      // Notify parent component
      if (onUsageCheck) {
        onUsageCheck(data);
      }
    } catch (error) {
      console.error('Failed to check usage:', error);
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'pro_plan', // Your Polar product ID
          userId: user.id
        })
      });
      
      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to create checkout:', error);
    }
  };

  // Show upgrade prompt if limit reached
  if (usage.count >= usage.limit && usage.plan === 'free') {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Usage Limit Reached
          </h2>
          
          <p className="text-gray-600 mb-6">
            You've used all {usage.limit} free summaries. Upgrade to Pro for unlimited access.
          </p>

          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-center mb-3">
              <Crown className="h-6 w-6 text-primary-600 mr-2" />
              <span className="font-semibold text-primary-700">MeetingMind Pro</span>
            </div>
            <div className="text-3xl font-bold text-primary-700 mb-2">$29/month</div>
            <ul className="text-sm text-primary-600 space-y-1">
              <li>✓ Unlimited meeting summaries</li>
              <li>✓ Priority processing</li>
              <li>✓ Advanced export options</li>
              <li>✓ Email support</li>
            </ul>
          </div>

          <button 
            onClick={handleUpgrade}
            className="btn-primary w-full mb-4"
          >
            Upgrade to Pro - $29/month
          </button>

          <p className="text-xs text-gray-500">
            Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    );
  }

  // Show usage indicator
  return (
    <div>
      {usage.plan === 'free' && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-primary-500" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Free Trial: {usage.count}/{usage.limit} summaries used
                </div>
                <div className="text-xs text-gray-500">
                  Upgrade for unlimited access
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowUpgrade(true)}
              className="text-sm bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}