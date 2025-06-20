'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Crown, Zap, AlertCircle, Sparkles, ArrowRight, TrendingUp, Star, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function SubscriptionHandler({ children, onUsageCheck, showProUpgradeIntent, showStarterUpgradeIntent }) {
  const { user } = useUser();
  const [usage, setUsage] = useState({ count: 0, limit: 3, plan: 'free' });
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [showStarterUpgrade, setShowStarterUpgrade] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserUsage();
    }
  }, [user]);

  useEffect(() => {
    if (showProUpgradeIntent) {
      setShowProUpgrade(true);
    } else if (showStarterUpgradeIntent) {
      setShowStarterUpgrade(true);
    }
  }, [showProUpgradeIntent, showStarterUpgradeIntent]);

  const refreshUsage = async () => {
    await checkUserUsage();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upgraded') === 'true') {
      setTimeout(refreshUsage, 1000);
    }
  }, []);

  const checkUserUsage = async () => {
    try {
      const response = await fetch('/api/user/usage');
      const data = await response.json();
      setUsage(data);
      
      if (onUsageCheck) {
        onUsageCheck(data);
      }

      window.dispatchEvent(new CustomEvent('usageUpdate', { 
        detail: { 
          usage: data,
          remaining: data.limit - data.count,
          usagePercent: (data.count / data.limit) * 100
        } 
      }));
    } catch (error) {
      console.error('Failed to check usage:', error);
    }
  };

  const handleUpgrade = async (plan = 'pro') => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      
      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to create checkout:', error);
    }
  };

  const remaining = usage.limit - usage.count;

  // Starter Upgrade Modal
  if (showStarterUpgrade) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-yellow-300" />
                <h3 className="text-2xl font-bold">Start with Starter</h3>
              </div>
              <button 
                onClick={() => setShowStarterUpgrade(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-lg">
                Perfect for getting started with regular content summarization
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-lg text-gray-900">What you'll get:</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">15 summaries per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Choose any AI model</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Up to 1 hour audio</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">All export formats</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">$9/month</div>
                <p className="text-gray-600">Perfect for individuals • Cancel anytime</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowStarterUpgrade(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
              <button 
                onClick={() => handleUpgrade('starter')}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Start with Starter</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pro Upgrade Modal
  if (showProUpgrade) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-8 w-8 text-yellow-300" />
                <h3 className="text-2xl font-bold">Upgrade to Pro</h3>
              </div>
              <button 
                onClick={() => setShowProUpgrade(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-lg">
                Unlock unlimited summaries and advanced multi-model analysis
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-lg text-gray-900">What you'll get:</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">50 summaries per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Multi-model comparison</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Up to 3 hour audio</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority processing</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Advanced exports</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">$19/month</div>
                <p className="text-gray-600">Most popular • Cancel anytime • 14-day guarantee</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowProUpgrade(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
              <button 
                onClick={() => handleUpgrade('pro')}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Upgrade Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full-screen upgrade when limit reached
  if (usage.count >= usage.limit && usage.plan === 'free') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
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
                <h2 className="text-4xl font-bold mb-4">🎉 Trial Complete!</h2>
                <p className="text-xl text-indigo-100 mb-2">
                  You've processed {usage.count} summaries successfully
                </p>
                <p className="text-lg text-indigo-200">Ready to unlock more content analysis?</p>
              </div>
            </div>

            <div className="p-8">
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

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Current Free Plan */}
                <div className="border-2 border-gray-200 rounded-2xl p-6 relative">
                  <div className="absolute -top-3 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Free Trial</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">3 summaries</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Choose any AI model</span>
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-500 line-through">More summaries</span>
                    </li>
                  </ul>
                  <div className="bg-gray-100 text-gray-600 py-3 px-4 rounded-lg text-center font-medium">
                    Trial Complete ✓
                  </div>
                </div>

                {/* Starter Plan */}
                <div className="border-2 border-gray-300 rounded-2xl p-6 relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-4">$9</div>
                  <div className="text-gray-600 mb-4">per month</div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">15 summaries/month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Any AI model</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">1 hour audio</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">All exports</span>
                    </li>
                  </ul>
                  
                  <button 
                    onClick={() => handleUpgrade('starter')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    Choose Starter
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-indigo-300 bg-indigo-50 rounded-2xl p-6 relative transform scale-105">
                  <div className="absolute -top-3 left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">$19</div>
                  <div className="text-gray-600 mb-4">per month</div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 font-medium">50 summaries/month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Multi-model comparison</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">3 hour audio</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Priority processing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Priority support</span>
                    </li>
                  </ul>
                  
                  <button 
                    onClick={() => handleUpgrade('pro')}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                  >
                    <span className="text-lg">Upgrade to Pro</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

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
                    <span>14-day guarantee</span>
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Join thousands who never miss important insights from their content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal case - just render children
  return <div>{children}</div>;
}

export const HeaderSubscriptionIndicator = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  
  useEffect(() => {
    const handleUsageUpdate = (event) => {
      const { usage, remaining } = event.detail;
      if (usage.plan === 'free' && remaining > 0) {
        setSubscriptionData({
          remaining,
          isLastSummary: remaining === 1
        });
      } else {
        setSubscriptionData(null);
      }
    };

    window.addEventListener('usageUpdate', handleUsageUpdate);
    return () => window.removeEventListener('usageUpdate', handleUsageUpdate);
  }, []);

  const handleUpgrade = async (plan = 'pro') => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      
      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to create checkout:', error);
    }
  };
  
  if (!subscriptionData) return null;
  
  const { isLastSummary } = subscriptionData;
  
  return (
    <>
      <button 
        onClick={() => handleUpgrade('pro')}
        className={`hidden sm:flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
          isLastSummary 
            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm'
        }`}
      >
        <Crown className="h-4 w-4 mr-1.5" />
        Upgrade
      </button>

      <div className="sm:hidden">
        <button 
          onClick={() => handleUpgrade('pro')}
          className={`text-xs font-medium transition-colors ${
            isLastSummary 
              ? 'text-amber-600 hover:text-amber-700'
              : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          Upgrade
        </button>
      </div>
    </>
  );
};

export const ProUserIndicator = () => {
  const [userPlan, setUserPlan] = useState(null);
  
  useEffect(() => {
    const handleUsageUpdate = (event) => {
      const { usage } = event.detail;
      if (usage.plan !== 'free') {
        setUserPlan(usage.plan);
      } else {
        setUserPlan(null);
      }
    };

    window.addEventListener('usageUpdate', handleUsageUpdate);
    return () => window.removeEventListener('usageUpdate', handleUsageUpdate);
  }, []);
  
  if (!userPlan) return null;
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-full border ${
        userPlan === 'pro' 
          ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-200'
          : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
      }`}>
        {userPlan === 'pro' ? (
          <Crown className="h-3 w-3 text-emerald-600" />
        ) : (
          <Zap className="h-3 w-3 text-gray-600" />
        )}
        <span className={`text-xs font-medium ${
          userPlan === 'pro' ? 'text-emerald-700' : 'text-gray-700'
        }`}>
          {userPlan === 'pro' ? 'Pro' : 'Starter'}
        </span>
      </div>
    </div>
  );
};