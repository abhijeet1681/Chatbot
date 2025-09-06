import React from 'react';
import { MessageCircle, Trash2, GraduationCap, BookOpen, Users, CreditCard } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { MessageBubble } from '../components/chat/MessageBubble';
import { DocumentSources } from '../components/chat/DocumentSources';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const HomePage: React.FC = () => {
  const { messages, isLoading, sources, sendMessage, clearChat } = useChat();
  const [inputMessage, setInputMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LearnLab LMS</h1>
                <p className="text-sm text-gray-600">AI Learning Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Courses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Community</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CreditCard className="w-4 h-4" />
                  <span>Payments</span>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Chat</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to LearnLab LMS</h3>
                <p className="text-gray-600 max-w-md mb-4">
                  I'm your AI learning assistant! I can help you with course information, enrollment, technical support, and learning guidance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-lg">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-blue-800">Course Info</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-green-800">Support</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <CreditCard className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-purple-800">Payments</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} chat={message} />
              ))
            )}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-600">
                <LoadingSpinner size="sm" />
                <span>AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Document Sources */}
          {sources.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <DocumentSources sources={sources} />
            </div>
          )}

          {/* Input Form */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <MessageCircle className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>&copy; 2024 LearnLab LMS. All rights reserved.</p>
        <p className="mt-1">Powered by React, Node.js, and AI Technology</p>
      </footer>
    </div>
  );
};
