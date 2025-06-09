'use client';

import { useUser } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import { Lock, Zap, Star } from 'lucide-react';

export default function AuthWrapper({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Show auth prompt if not signed in
  if (!isSignedIn) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-primary-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign in to access MeetingMind
          </h2>
          
          <p className="text-gray-600 mb-8">
            Create your account to start transforming meeting recordings into actionable summaries.
          </p>

          {/* Pricing Preview */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Zap className="h-5 w-5 text-primary-500 mx-auto mb-2" />
              <div className="font-medium">Free Trial</div>
              <div className="text-gray-500">3 summaries</div>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg border-2 border-primary-200">
              <Star className="h-5 w-5 text-primary-600 mx-auto mb-2" />
              <div className="font-medium text-primary-700">Pro</div>
              <div className="text-primary-600">$29/month</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="h-5 w-5 bg-gray-400 rounded mx-auto mb-2"></div>
              <div className="font-medium">Enterprise</div>
              <div className="text-gray-500">Custom</div>
            </div>
          </div>

          <SignInButton mode="modal">
            <button className="btn-primary w-full">
              Get Started - Sign In
            </button>
          </SignInButton>

          <p className="text-xs text-gray-500 mt-4">
            No credit card required for trial
          </p>
        </div>
      </div>
    );
  }

  // Show main app if signed in
  return children;
}