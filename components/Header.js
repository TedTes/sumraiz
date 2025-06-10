import { Brain } from 'lucide-react';
import { SignInButton, SignOutButton, UserButton, useUser } from '@clerk/nextjs';

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4">
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
          
          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user.firstName || 'User'}!
                </span>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
        
     
      </div>
    </header>
  );
}