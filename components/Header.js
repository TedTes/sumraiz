import { Brain } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-500 p-2 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MeetingMind</h1>
            <p className="text-sm text-gray-600">AI-powered meeting summarizer</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-700 max-w-2xl">
            Upload your meeting recording and get structured summaries with action items, 
            key decisions, and next steps in minutes.
          </p>
        </div>
      </div>
    </header>
  );
}