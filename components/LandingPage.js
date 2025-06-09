'use client';

import { SignInButton } from '@clerk/nextjs';
import { Brain, Play, Check, Zap, FileText, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MeetingMind</h1>
                <p className="text-sm text-gray-600">AI-powered meeting summarizer</p>
              </div>
            </div>
            
            <SignInButton mode="modal">
              <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium">
                Get Started
              </button>
            </SignInButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Meeting Recordings Into<br />
            <span className="text-primary-600">Organized Action Items</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Upload your meeting audio and get structured summaries with decisions, 
            action items, and next steps. No more manual note-taking.
          </p>
          
          {/* Demo Video Placeholder */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-3">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:from-primary-100 hover:to-primary-200 transition-all">
                <div className="text-center">
                  <div className="bg-primary-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary-600 transition-colors">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                  <p className="text-primary-700 font-semibold text-lg">Watch 60-Second Demo</p>
                  <p className="text-primary-600">See MeetingMind transform a real meeting</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <section className="bg-primary-50 border-t border-primary-100 py-20">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <h3 className="text-3xl font-bold text-gray-900 mb-4">
      Ready to Transform Your Meetings?
    </h3>
    <p className="text-xl text-gray-600 mb-8">
      Join teams who never miss important action items
    </p>
    <SignInButton mode="modal">
      <button className="bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors shadow-sm">
        Get Started Free
      </button>
    </SignInButton>
    <p className="text-gray-500 mt-4">No credit card required • 3 free summaries</p>
  </div>
</section>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600">Three simple steps to transform your meetings</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Upload Audio</h4>
              <p className="text-gray-600">Drag & drop your meeting recording (MP3, M4A, WAV, WebM)</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">AI Processing</h4>
              <p className="text-gray-600">Our AI transcribes and analyzes your meeting in 2-3 minutes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Get Results</h4>
              <p className="text-gray-600">Receive organized summaries with action items and decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">  
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MeetingMind?</h3>
            <p className="text-lg text-gray-600">Built for teams who value their time</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-sm transition-shadow">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h4>
              <p className="text-gray-600">Process 45-minute meetings in under 3 minutes with industry-leading AI</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-sm transition-shadow">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Structured Output</h4>
              <p className="text-gray-600">Get organized sections for decisions, action items, and next steps</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-sm transition-shadow">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Save Time</h4>
              <p className="text-gray-600">Eliminate 30+ minutes of manual note-taking per meeting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h3>
            <p className="text-lg text-gray-600">Start free, upgrade when you need more</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free Trial */}
            <div className="border-2 border-gray-200 rounded-xl p-8 text-center">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Free Trial</h4>
              <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>3 meeting summaries</span>
                </li>
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>All AI features</span>
                </li>
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Export summaries</span>
                </li>
              </ul>
              <SignInButton mode="modal">
                <button className="w-full border-2 border-primary-500 text-primary-500 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                  Start Free Trial
                </button>
              </SignInButton>
            </div>
            
            {/* Pro Plan */}
            <div className="border-2 border-primary-500 rounded-xl p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Pro</h4>
              <div className="text-3xl font-bold text-gray-900 mb-1">$29</div>
              <div className="text-gray-500 mb-6">per month</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited summaries</span>
                </li>
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority processing</span>
                </li>
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced exports</span>
                </li>
                <li className="flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Email support</span>
                </li>
              </ul>
              <SignInButton mode="modal">
                <button className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  Start Pro Trial
                </button>
              </SignInButton>
            </div>
          </div>
          
          <p className="text-center text-gray-500 mt-8">
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Meetings?
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            Join teams who never miss important action items
          </p>
          <SignInButton mode="modal">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Get Started Free
            </button>
          </SignInButton>
          <p className="text-primary-200 mt-4">No credit card required • 3 free summaries</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <div className="flex items-center justify-center space-x-2 mb-4">
      <Brain className="h-5 w-5 text-primary-500" />
      <span className="font-semibold text-gray-700">MeetingMind</span>
    </div>
    <p className="text-sm text-gray-600">Built with Next.js and OpenAI • Transform your meetings into actionable insights</p>
  </div>
</footer>
    </div>
  );
}