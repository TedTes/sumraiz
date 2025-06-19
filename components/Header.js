import { Brain, Sparkles } from 'lucide-react';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { HeaderSubscriptionIndicator } from './SubscriptionHandler';

export default function Header() {
  const { isSignedIn, user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/80' 
        : 'bg-white shadow-sm border-b border-gray-200'
    }`}>
      <div className=" px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              {/* Main logo container with gradient */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Brain className="h-7 w-7 text-white" />
                
                {/* Animated sparkle effect */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                </div>
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  MeetingMind
                </h1>
                {/* AI badge */}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  AI
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                AI-powered meeting summarizer
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                
 
                <HeaderSubscriptionIndicator />
  
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-800">
                    Welcome back!
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                  </div>
                </div>
                
                {/* Enhanced User Button */}
                <div className="relative">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10 hover:ring-4 hover:ring-indigo-100 transition-all duration-200 shadow-md hover:shadow-lg",
                        userButtonPopoverCard: "shadow-2xl border-0",
                        userButtonPopoverActions: "bg-gray-50"
                      }
                    }}
                  />
                  
                  {/* Online status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                
                {/* Sign In Button */}
                <SignInButton mode="modal">
                  <button className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden">
                    {/* Button content */}
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>Sign In</span>
                      <Sparkles className="h-4 w-4 group-hover:animate-spin" />
                    </span>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                </SignInButton>
                
                {/* Optional CTA for new users */}
                <div className="hidden lg:block text-right">
                  <div className="text-sm font-medium text-gray-800">
                    New here?
                  </div>
                  <div className="text-xs text-gray-500">
                    Start your free trial
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative bottom border with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
    </header>
  );
}

