'use client';

import { SignInButton } from '@clerk/nextjs';
import { Brain, Play, Check, Zap, FileText, Clock, Sparkles, ArrowRight, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/*  Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Brain className="h-7 w-7 text-white" />
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    MeetingMind
                  </h1>
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    AI
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  AI-powered meeting summarizer
                </p>
              </div>
            </div>
            
            <SignInButton mode="modal">
              <button className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </SignInButton>
          </div>
        </div>
      </header>

      {/*  Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-indigo-500 mr-2" />
            <span className="text-sm font-medium text-indigo-700">Powered by advanced AI technology</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Meeting Recordings Into<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Organized Action Items
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Upload your meeting audio and get structured summaries with decisions, 
            action items, and next steps. No more manual note-taking or missed follow-ups.
          </p>
          
   
{/* Demo Video Section */}
<div className="max-w-4xl mx-auto mb-12">
  <div className="bg-white rounded-3xl shadow-2xl p-4">
    <video 
      className="w-full h-full rounded-2xl aspect-video shadow-lg"
      controls
      preload="metadata"
    >
      <source src="/meeting-mind-demo.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</div>
          
          {/*  CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <SignInButton mode="modal">
              <button className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <Sparkles className="h-5 w-5 group-hover:animate-spin" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </SignInButton>
            
            <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </div>
          
          <p className="text-gray-500">No credit card required • 3 free summaries • Setup in 2 minutes</p>
        </div>
      </section>

      {/*  How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600">Three simple steps to transform your meetings</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Upload Audio</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Drag & drop your meeting recording. Supports MP3, M4A, WAV, WebM, and MP4 files up to 50MB.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">2</span>
                </div>
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">AI Processing</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Our advanced AI transcribes and analyzes your meeting content in just 2-3 minutes with high accuracy.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">3</span>
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-emerald-600 text-sm">🎉</span>
                </div>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Get Results</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Receive beautifully organized summaries with action items, decisions, and next steps ready to share.</p>
            </div>
          </div>
        </div>
      </section>

      {/*  Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">  
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MeetingMind?</h3>
            <p className="text-xl text-gray-600">Built for teams who value their time and productivity</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Lightning Fast</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Process 45-minute meetings in under 3 minutes with industry-leading AI technology and cloud processing.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Structured Output</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Get professionally organized sections for decisions, action items, next steps, and key discussion points.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Save Hours</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Eliminate 30+ minutes of manual note-taking per meeting and never miss important action items again.</p>
            </div>
          </div>
        </div>
      </section>

      {/*  Pricing */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h3>
            <p className="text-xl text-gray-600">Start free, upgrade when you need more power</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Trial */}
            <div className="border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-gray-300 transition-colors group">
              <h4 className="text-2xl font-semibold text-gray-900 mb-3">Free Trial</h4>
              <div className="text-5xl font-bold text-gray-900 mb-2">$0</div>
              <div className="text-gray-500 mb-8">Perfect to get started</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center justify-center text-lg">
                  <Check className="h-6 w-6 text-green-500 mr-3" />
                  <span>3 meeting summaries</span>
                </li>
                <li className="flex items-center justify-center text-lg">
                  <Check className="h-6 w-6 text-green-500 mr-3" />
                  <span>All AI features</span>
                </li>
                <li className="flex items-center justify-center text-lg">
                  <Check className="h-6 w-6 text-green-500 mr-3" />
                  <span>Export summaries</span>
                </li>
                <li className="flex items-center justify-center text-lg">
                  <Check className="h-6 w-6 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
              <SignInButton mode="modal" forceRedirectUrl="/">
                <button className="w-full border-2 border-indigo-500 text-indigo-600 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors group-hover:scale-105">
                  Start Free Trial
                </button>
              </SignInButton>
            </div>
            
            {/* Pro Plan */}
            <div className="border-2 border-indigo-500 rounded-2xl p-8 text-center relative bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </span>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-3">Pro</h4>
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">$29</div>
              <div className="text-gray-500 mb-8">per month</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center justify-center text-lg">
                  <Check className="h-6 w-6 text-green-500 mr-3" />
                  <span>Unlimited summaries</span>
                </li>
                <li className="flex items-center justify-center text-lg">
                  <Check className="h-6 w-6 text-green-500 mr-3" />
                  <span>Priority processing</span>
                </li>
                <li className="flex items-center justify-center text-lg">
                  <Check className="h-6 w-6 text-green-500 mr-3" />
                  <span>Advanced exports (PDF, Word)</span>
                </li>
                <li className="flex items-center justify-center text-lg">
                  <Check className="h-6 w-6 text-green-500 mr-3" />
                  <span>Calendar integration</span>
                </li>
                <li className="flex items-center justify-center text-lg">
                  <Check className="h-6 w-6 text-green-500 mr-3" />
                  <span>Priority email support</span>
                </li>
              </ul>
              <SignInButton mode="modal" forceRedirectUrl="/?intent=pro">
                <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105">
                  Start Pro Trial
                </button>
              </SignInButton>
            </div>
          </div>
          
          <p className="text-center text-gray-500 mt-12 text-lg">
            30-day money-back guarantee • Cancel anytime • No hidden fees
          </p>
        </div>
      </section>

      {/*  Final CTA */}
      <section className="bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
          <div className="w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
          <div className="w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Meetings?
          </h3>
          <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
            Start transforming your meetings into actionable insights.<br />
            Begin your free trial today - no credit card required.
          </p>
          <SignInButton mode="modal" forceRedirectUrl="/">
            <button className="group bg-white text-indigo-600 px-10 py-5 rounded-xl text-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105">
              <span className="flex items-center space-x-3">
                <span>Get Started Free</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </button>
          </SignInButton>
          <p className="text-indigo-200 mt-6 text-lg">3 free summaries • Setup in 2 minutes • Cancel anytime</p>
        </div>
      </section>

      {/*  Footer */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                MeetingMind
              </span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                AI
              </span>
            </div>
            
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Transform your meetings into actionable insights with AI-powered summarization.<br />
              Built with Next.js and OpenAI for maximum performance and reliability.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚡</span>
                <span>Powered by OpenAI</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🚀</span>
                <span>Built with Next.js</span>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-400">
                © 2025 MeetingMind. Transforming conversations into clarity.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}