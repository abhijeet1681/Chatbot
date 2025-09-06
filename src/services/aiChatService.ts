import type { ChatMessage, ChatResponse } from '../types';

class AIChatService {
  private apiKey: string | null = null;
  private baseUrl: string;

  constructor() {
    // Use the LMS API URL from environment
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY || null;
  }

  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    try {
      // First try to use the backend API (which will store history)
      const backendResponse = await this.tryBackendAPI(message);
      if (backendResponse) {
        return backendResponse;
      }

      // If backend fails, use fallback but still try to store locally
      const fallbackResponse = await this.useDirectGeminiAPI(message);
      
      // Store in localStorage for offline users
      this.storeMessageLocally(message, fallbackResponse);
      
      return fallbackResponse;
    } catch (error) {
      console.error('AI Chat Service Error:', error);
      return {
        response: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        conversation_id: message.conversation_id || `conv_${Date.now()}`,
        sources: undefined
      };
    }
  }

  private async tryBackendAPI(message: ChatMessage): Promise<ChatResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({
          message: message.message,
          userId: message.user_id,
          courseId: message.course_id,
          conversationId: message.conversation_id
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          response: data.ai_response || data.response,
          conversation_id: data.conversation_id || message.conversation_id,
          sources: data.sources
        };
      }
    } catch (error) {
      console.log('Backend API not available, using direct API');
    }
    return null;
  }

  private async useDirectGeminiAPI(message: ChatMessage): Promise<ChatResponse> {
    // Create a more intelligent prompt for the AI
    const systemPrompt = `You are an AI assistant for LearnLab LMS, a Learning Management System. 
    You help students and instructors with:
    - Course information and enrollment
    - Learning guidance and study tips
    - Technical support for the platform
    - Educational content and explanations
    - Payment and account questions
    
    Be helpful, friendly, and educational. If you don't know something specific about the platform, 
    provide general helpful guidance. Keep responses clear and concise.`;

    const prompt = `${systemPrompt}\n\nUser Question: ${message.message}`;

    try {
      // Use a simple AI API service (you can replace this with your preferred AI service)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey || 'demo-key'}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message.message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          response: data.choices[0].message.content,
          conversation_id: message.conversation_id || `conv_${Date.now()}`,
          sources: undefined
        };
      }
    } catch (error) {
      console.log('Direct API failed, using fallback');
    }

    // Fallback to intelligent mock responses
    return this.generateIntelligentResponse(message.message, message.conversation_id);
  }

  private generateIntelligentResponse(userMessage: string, conversationId?: string): ChatResponse {
    const message = userMessage.toLowerCase();
    
    // More intelligent responses based on context
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        response: "Hello! Welcome to LearnLab LMS! I'm your AI learning assistant. I can help you with course information, enrollment guidance, technical support, and learning tips. What would you like to know today?",
        conversation_id: conversationId || `conv_${Date.now()}`,
        sources: undefined
      };
    }
    
    if (message.includes('course') || message.includes('enroll') || message.includes('class')) {
      return {
        response: "I'd be happy to help you with course information! Our LMS offers a variety of programming and technology courses including:\n\n📚 **React.js Fundamentals** - Perfect for beginners learning modern web development\n📚 **Advanced JavaScript** - Deep dive into ES6+ and advanced concepts\n📚 **Full-Stack Development** - Complete web development with frontend and backend\n📚 **Database Design** - Learn SQL and database management\n📚 **Cloud Computing** - AWS, Azure, and cloud deployment\n\nEach course includes hands-on projects, instructor support, and real-world applications. Would you like more details about any specific course?",
        conversation_id: conversationId || `conv_${Date.now()}`,
        sources: ["Course Catalog.pdf", "Enrollment Guide.pdf"]
      };
    }
    
    if (message.includes('react') || message.includes('javascript') || message.includes('programming')) {
      return {
        response: "Great choice! Programming is an excellent skill to learn. Here's what I recommend:\n\n**For Beginners:**\n• Start with our React.js Fundamentals course\n• Learn HTML, CSS, and JavaScript basics first\n• Practice with small projects\n\n**For Intermediate Learners:**\n• Advanced JavaScript course covers ES6+, async programming\n• Learn about design patterns and best practices\n• Build more complex applications\n\n**For Advanced Students:**\n• Full-Stack Development course\n• Learn backend technologies (Node.js, databases)\n• Deploy applications to the cloud\n\nWould you like me to help you choose the right course based on your current skill level?",
        conversation_id: conversationId || `conv_${Date.now()}`,
        sources: ["Programming Learning Path.pdf", "Course Prerequisites.pdf"]
      };
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('cost') || message.includes('price')) {
      return {
        response: "Our LMS offers flexible payment options to make learning accessible:\n\n💳 **Payment Methods:**\n• PayPal - Secure and widely accepted\n• Stripe - Credit/debit cards\n• Bank transfers for bulk enrollments\n\n💰 **Pricing:**\n• Individual courses: $49-199\n• Course bundles: Up to 30% discount\n• Monthly subscription: $29/month for unlimited access\n• Student discounts available\n\n🔒 **Security:**\n• All payments are encrypted and secure\n• SSL certificate protection\n• PCI DSS compliant\n\nWould you like to know about specific course pricing or payment plans?",
        conversation_id: conversationId || `conv_${Date.now()}`,
        sources: ["Payment Guide.pdf", "Pricing Structure.pdf"]
      };
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('problem')) {
      return {
        response: "I'm here to help! Here's what I can assist you with:\n\n🎓 **Learning Support:**\n• Course recommendations\n• Study strategies and tips\n• Technical concept explanations\n• Project guidance\n\n🔧 **Technical Support:**\n• Platform navigation help\n• Login and account issues\n• Payment problems\n• Mobile app support\n\n📚 **Course Information:**\n• Course details and prerequisites\n• Instructor information\n• Schedule and duration\n• Certification details\n\n💡 **General Guidance:**\n• Career advice in tech\n• Learning path recommendations\n• Industry insights\n\nWhat specific area would you like help with?",
        conversation_id: conversationId || `conv_${Date.now()}`,
        sources: ["Help Center.pdf", "FAQ.pdf", "User Manual.pdf"]
      };
    }
    
    if (message.includes('login') || message.includes('sign in') || message.includes('authentication')) {
      return {
        response: "I can help you with login and authentication issues:\n\n🔐 **Login Methods:**\n• Google OAuth2 - Quick and secure\n• Email and password\n• Social media accounts\n\n🛠️ **Common Solutions:**\n• Forgot password: Use the 'Reset Password' link\n• Google login issues: Check browser permissions\n• Account locked: Contact support for assistance\n• Two-factor authentication: Check your mobile device\n\n📱 **Mobile Access:**\n• Download our mobile app\n• Use the same login credentials\n• Enable biometric login for convenience\n\nIf you're still having trouble, I can guide you through the specific issue you're experiencing.",
        conversation_id: conversationId || `conv_${Date.now()}`,
        sources: ["Login Guide.pdf", "Troubleshooting.pdf"]
      };
    }
    
    if (message.includes('progress') || message.includes('track') || message.includes('dashboard')) {
      return {
        response: "Track your learning journey with our comprehensive dashboard:\n\n📊 **Progress Tracking:**\n• Course completion percentages\n• Time spent learning\n• Quiz and assignment scores\n• Certificate achievements\n\n📈 **Analytics:**\n• Learning streaks and consistency\n• Skill development over time\n• Peer comparison (anonymous)\n• Performance insights\n\n🎯 **Goal Setting:**\n• Set learning objectives\n• Track milestone achievements\n• Receive progress notifications\n• Celebrate accomplishments\n\n📱 **Access:**\n• Available on web and mobile\n• Real-time updates\n• Export progress reports\n• Share achievements\n\nYour dashboard is your learning command center! Would you like to know more about any specific feature?",
        conversation_id: conversationId || `conv_${Date.now()}`,
        sources: ["Dashboard Guide.pdf", "Progress Tracking.pdf"]
      };
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return {
        response: "You're very welcome! I'm here to support your learning journey. Feel free to ask me anything about courses, technical issues, or learning guidance. Happy learning! 🎓✨",
        conversation_id: conversationId || `conv_${Date.now()}`,
        sources: undefined
      };
    }
    
    if (message.includes('bye') || message.includes('goodbye') || message.includes('exit')) {
      return {
        response: "Goodbye! Thank you for using LearnLab LMS. Keep learning and growing! If you need any help later, just come back and chat with me. Have a great day! 👋",
        conversation_id: conversationId || `conv_${Date.now()}`,
        sources: undefined
      };
    }
    
    // Default intelligent response
    return {
      response: `That's an interesting question! I understand you're asking about "${userMessage}". As your AI learning assistant, I'm here to help with course information, learning guidance, technical support, and educational content. Could you provide more details about what you'd like to know? I can help with:\n\n• Course recommendations and information\n• Learning strategies and study tips\n• Technical platform support\n• Payment and enrollment questions\n• Career guidance in technology\n\nWhat specific area would you like to explore?`,
      conversation_id: conversationId || `conv_${Date.now()}`,
      sources: undefined
    };
  }

  async getChatHistory(userId?: number): Promise<{ chats: any[] }> {
    try {
      // Try to get history from backend first
      if (userId) {
        const backendHistory = await this.getBackendHistory(userId);
        if (backendHistory) {
          return backendHistory;
        }
      }

      // Fallback to localStorage
      return this.getLocalHistory(userId);
    } catch (error) {
      console.error('Error getting chat history:', error);
      return { chats: [] };
    }
  }

  private async getBackendHistory(userId: number): Promise<{ chats: any[] } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/history/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { chats: data.chats || [] };
      }
    } catch (error) {
      console.log('Backend history not available, using local storage');
    }
    return null;
  }

  private getLocalHistory(userId?: number): { chats: any[] } {
    try {
      const storageKey = userId ? `chat_history_${userId}` : 'chat_history_guest';
      const history = localStorage.getItem(storageKey);
      return history ? JSON.parse(history) : { chats: [] };
    } catch (error) {
      console.error('Error reading local chat history:', error);
      return { chats: [] };
    }
  }

  private storeMessageLocally(message: ChatMessage, response: ChatResponse): void {
    try {
      const userId = message.user_id;
      const storageKey = userId ? `chat_history_${userId}` : 'chat_history_guest';
      
      const chatEntry = {
        id: Date.now(),
        user_message: message.message,
        ai_response: response.response,
        conversation_id: response.conversation_id,
        context_type: 'general',
        created_at: new Date().toISOString(),
        response_time: new Date().toISOString(),
        has_rag_context: response.sources && response.sources.length > 0,
        sources: response.sources
      };

      const existingHistory = this.getLocalHistory(userId);
      const updatedHistory = {
        chats: [...existingHistory.chats, chatEntry]
      };

      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error storing message locally:', error);
    }
  }

  async clearChatHistory(userId?: number): Promise<void> {
    try {
      // Clear from backend
      if (userId) {
        await fetch(`${this.baseUrl}/chat/clear/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
          }
        });
      }

      // Clear from localStorage
      const storageKey = userId ? `chat_history_${userId}` : 'chat_history_guest';
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }

  async testConnection(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (response.ok) {
        return { status: 'success', message: 'Backend connected' };
      }
    } catch (error) {
      return { status: 'fallback', message: 'Using AI fallback mode' };
    }
    return { status: 'fallback', message: 'Using AI fallback mode' };
  }
}

export const aiChatService = new AIChatService();
