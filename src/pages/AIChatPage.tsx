import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, GraduationCap, Trash2, Send, Bot, User, LogIn, LogOut } from 'lucide-react';
import { useAuthenticatedChat } from '../contexts/AuthenticatedChatContext';

interface Message {
  id: number;
  user: string;
  ai: string;
  timestamp: Date;
  sources?: string[];
}

export const AIChatPage: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearChat, 
    currentUser, 
    setCurrentUser,
    loadChatHistory 
  } = useAuthenticatedChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    await sendMessage(userMessage);
  };

  const handleLogin = () => {
    // Simulate user login - in real app, this would come from your auth system
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    };
    
    // Store user data in localStorage (simulating your auth system)
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    localStorage.setItem('auth_token', 'mock_jwt_token');
    
    setCurrentUser(mockUser);
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
    
    setCurrentUser(null);
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
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Online</span>
              </div>
              
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="w-4 h-4" />
                    <span>{currentUser.name}</span>
                    <span className="text-xs text-gray-500">({currentUser.role})</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
              
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
          <div className="h-96 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentUser ? `Welcome back, ${currentUser.name}!` : 'AI Learning Assistant'}
                </h3>
                <p className="text-gray-600 max-w-md mb-4">
                  {currentUser 
                    ? `I'm here to help you with your learning journey, ${currentUser.name}. Your chat history is saved and will be available across all your devices.`
                    : 'I\'m powered by advanced AI to help you with courses, learning guidance, and technical support. Login to save your chat history.'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-lg">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-blue-800">Smart Responses</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-green-800">Learning Support</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <User className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-purple-800">24/7 Available</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="flex items-end space-x-2 max-w-3xl">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-2xl rounded-br-md shadow-lg">
                        <p className="text-sm leading-relaxed">{message.user_message}</p>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2 max-w-3xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Bot className="w-3 h-3 mr-1" />
                            AI Assistant
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{new Date(message.created_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                          {message.ai_response}
                        </p>

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-600 mb-2">📚 Sources:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.sources.map((source, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about courses, learning, or technical support..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>&copy; 2024 LearnLab LMS. All rights reserved.</p>
        <p className="mt-1">Powered by Advanced AI Technology</p>
      </footer>
    </div>
  );
};
