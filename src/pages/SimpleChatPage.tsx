import React, { useState } from 'react';
import { MessageCircle, GraduationCap, Trash2 } from 'lucide-react';

export const SimpleChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{id: number, user: string, ai: string}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: userMessage,
        ai: aiResponse
      }]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! Welcome to LearnLab LMS! I'm your AI learning assistant. I can help you with course information, enrollment, technical support, and learning guidance. How can I assist you today?";
    }
    
    if (message.includes('course') || message.includes('enroll')) {
      return "Here are some popular courses available in our LMS:\n\n📚 **React.js Fundamentals**\n   👨‍🏫 Instructor: Dr. Sarah Johnson\n   ⏱️ Duration: 8 weeks\n   📊 Level: Beginner\n\n📚 **Advanced JavaScript**\n   👨‍🏫 Instructor: Prof. Mike Chen\n   ⏱️ Duration: 12 weeks\n   📊 Level: Intermediate\n\n📚 **Full-Stack Development**\n   👨‍🏫 Instructor: Dr. Emily Rodriguez\n   ⏱️ Duration: 16 weeks\n   📊 Level: Advanced\n\nYou can browse all courses, read detailed descriptions, and enroll directly from the course catalog. Would you like to know more about any specific course?";
    }
    
    if (message.includes('react')) {
      return "**React.js Fundamentals** is perfect for beginners! This 8-week course covers:\n\n• Component-based architecture\n• JSX and virtual DOM\n• State and props management\n• Hooks and functional components\n• Routing and navigation\n• State management with Redux\n\nTaught by Dr. Sarah Johnson, this course includes hands-on projects and real-world applications. Ready to start your React journey?";
    }
    
    if (message.includes('payment') || message.includes('pay')) {
      return "Our LMS supports secure payments through PayPal and Stripe integration. You can add courses to your cart and checkout safely. All transactions are encrypted and secure. Need help with a specific payment issue?";
    }
    
    if (message.includes('help')) {
      return "**LearnLab LMS Help Center** 🎓\n\nI can assist you with:\n\n📚 **Course Management**\n• Browse and enroll in courses\n• Track your learning progress\n• Access course materials\n\n💬 **Communication**\n• Real-time chat with peers and instructors\n• Course discussions and Q&A\n\n💳 **Payments**\n• Secure checkout with PayPal/Stripe\n• Course pricing and discounts\n\n🔐 **Account**\n• Google OAuth2 login\n• Profile management\n• Theme preferences (Dark/Light mode)\n\nWhat specific area would you like help with?";
    }
    
    return "That's a great question about our LMS! Our platform offers comprehensive learning management with features like course enrollment, real-time chat, progress tracking, and secure payments. Could you be more specific about what you'd like to know? I can help with courses, enrollment, technical issues, or any other LMS features.";
  };

  const clearChat = () => {
    setMessages([]);
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
            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>
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
                <p className="text-gray-600 max-w-md">
                  I'm your AI learning assistant! I can help you with course information, enrollment, technical support, and learning guidance.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-2xl rounded-br-md shadow-lg max-w-3xl">
                      <p className="text-sm leading-relaxed">{message.user}</p>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-200 max-w-3xl">
                      <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{message.ai}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>AI is thinking...</span>
              </div>
            )}
          </div>

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
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
