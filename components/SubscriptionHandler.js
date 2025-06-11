'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Crown, Zap, AlertCircle, Sparkles, ArrowRight, TrendingUp, Star, Check } from 'lucide-react';

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

  const remaining = usage.limit - usage.count;
  const usagePercent = (usage.count / usage.limit) * 100;

  // Enhanced Upgrade Modal/Screen when limit reached
  if (usage.count >= usage.limit && usage.plan === 'free') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          
          {/* Main upgrade card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
                <div className="w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
              <div className="absolute bottom-0 left-0 translate-y-8 -translate-x-8">
                <div className="w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Crown className="h-10 w-10 text-yellow-300" />
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  🎉 Trial Complete!
                </h2>
                <p className="text-xl text-indigo-100 mb-2">
                  You've processed {usage.count} meetings successfully
                </p>
                <p className="text-lg text-indigo-200">
                  Ready to unlock unlimited access?
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              
              {/* Stats showcase */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center bg-emerald-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-emerald-600">{usage.count}</div>
                  <div className="text-sm text-emerald-700">Summaries Created</div>
                </div>
                <div className="text-center bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">~{usage.count * 30}min</div>
                  <div className="text-sm text-blue-700">Time Saved</div>
                </div>
                <div className="text-center bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-purple-700">Trial Used</div>
                </div>
              </div>

              {/* Pricing comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                
                {/* Free plan (current) */}
                <div className="border-2 border-gray-200 rounded-2xl p-6 relative">
                  <div className="absolute -top-3 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Free Trial</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">3 meeting summaries</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Basic AI features</span>
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-500 line-through">Unlimited access</span>
                    </li>
                  </ul>
                  <div className="bg-gray-100 text-gray-600 py-3 px-4 rounded-lg text-center font-medium">
                    Trial Complete ✓
                  </div>
                </div>

                {/* Pro plan */}
                <div className="border-2 border-indigo-300 bg-indigo-50 rounded-2xl p-6 relative transform scale-105">
                  <div className="absolute -top-3 left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Recommended</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">MeetingMind Pro</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">$29</div>
                  <div className="text-gray-600 mb-4">per month</div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 font-medium">Unlimited summaries</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Priority processing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Advanced exports (PDF, Word)</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Email integration</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Priority support</span>
                    </li>
                  </ul>
                  
                  <button 
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                  >
                    <span className="text-lg">Upgrade Now</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <span>🔒</span>
                    <span>Secure payments</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>💳</span>
                    <span>Cancel anytime</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>🎯</span>
                    <span>30-day guarantee</span>
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Join hundreds of teams who never miss important action items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced usage indicator for active users
  return (
    <div>
      {usage.plan === 'free' && remaining > 0 && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className={`rounded-2xl p-4 transition-all duration-300 ${
            remaining === 1 
              ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200' 
              : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${
                  remaining === 1 ? 'bg-amber-100' : 'bg-indigo-100'
                }`}>
                  {remaining === 1 ? (
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {remaining === 1 ? 'Last Free Summary!' : `${remaining} Free Summaries Left`}
                  </div>
                  <div className="text-gray-600">
                    {remaining === 1 
                      ? 'Make it count, then unlock unlimited access' 
                      : 'Upgrade anytime for unlimited processing'
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Progress indicator */}
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">{usage.count}/{usage.limit}</span>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        remaining === 1 
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    ></div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowUpgrade(true)}
                  className={`font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
                    remaining === 1 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg'
                      : 'bg-white border-2 border-indigo-200 hover:border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span>{remaining === 1 ? 'Upgrade Now' : 'Upgrade'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}