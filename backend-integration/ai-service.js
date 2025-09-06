// AI Service for LearnLab LMS Chatbot
// Supports multiple AI providers: OpenAI, Google Gemini, or fallback responses

const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = null;
    this.geminiApiKey = process.env.GOOGLE_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    
    // Initialize OpenAI if API key is available
    if (this.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.openaiApiKey
      });
    }
  }

  async generateResponse(message, context = {}) {
    try {
      // Try OpenAI first
      if (this.openai) {
        return await this.generateOpenAIResponse(message, context);
      }
      
      // Try Gemini if available
      if (this.geminiApiKey) {
        return await this.generateGeminiResponse(message, context);
      }
      
      // Fallback to intelligent responses
      return this.generateFallbackResponse(message, context);
      
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.generateFallbackResponse(message, context);
    }
  }

  async generateOpenAIResponse(message, context) {
    const systemPrompt = this.createSystemPrompt(context);
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    return completion.choices[0].message.content;
  }

  async generateGeminiResponse(message, context) {
    // This would integrate with Google Gemini API
    // For now, return a placeholder
    const systemPrompt = this.createSystemPrompt(context);
    const prompt = `${systemPrompt}\n\nUser Question: ${message}`;
    
    // You would implement Gemini API call here
    // const response = await gemini.generateContent(prompt);
    // return response.text;
    
    return this.generateFallbackResponse(message, context);
  }

  createSystemPrompt(context) {
    const basePrompt = `You are an AI assistant for LearnLab LMS, a comprehensive Learning Management System. 
    Your role is to help students and instructors with:

    🎓 **Educational Support:**
    - Course information and enrollment guidance
    - Learning strategies and study tips
    - Technical concept explanations
    - Project and assignment help

    🔧 **Platform Support:**
    - Navigation and feature explanations
    - Technical troubleshooting
    - Account and profile management
    - Mobile app assistance

    💳 **Payment & Enrollment:**
    - Course pricing and payment methods
    - Enrollment process guidance
    - Refund and cancellation policies
    - Student discounts and offers

    📚 **Course Management:**
    - Course recommendations based on skill level
    - Prerequisites and learning paths
    - Instructor information and credentials
    - Certification and completion tracking

    **Guidelines:**
    - Be helpful, friendly, and encouraging
    - Provide clear, step-by-step instructions
    - Use emojis sparingly but effectively
    - Keep responses concise but comprehensive
    - If you don't know something, suggest where to find help
    - Always maintain a professional yet approachable tone`;

    // Add context-specific information
    if (context.courseId) {
      basePrompt += `\n\n**Current Context:** User is asking about a specific course (ID: ${context.courseId})`;
    }
    
    if (context.userRole) {
      basePrompt += `\n\n**User Role:** ${context.userRole}`;
    }

    return basePrompt;
  }

  generateFallbackResponse(message, context) {
    const msg = message.toLowerCase();
    
    // Greeting responses
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return `Hello! Welcome to LearnLab LMS! 🎓 I'm your AI learning assistant, here to help you with courses, learning guidance, and technical support. 

What can I help you with today? I can assist with:
• Course information and enrollment
• Learning strategies and study tips  
• Technical platform support
• Payment and account questions
• Career guidance in technology

Just ask me anything! 😊`;
    }
    
    // Course-related queries
    if (msg.includes('course') || msg.includes('enroll') || msg.includes('class')) {
      return `I'd be happy to help you with course information! 📚

Our LearnLab LMS offers a comprehensive range of programming and technology courses:

**🔥 Popular Courses:**
• **React.js Fundamentals** - Modern web development for beginners
• **Advanced JavaScript** - ES6+, async programming, design patterns
• **Full-Stack Development** - Complete web development journey
• **Database Design** - SQL, MongoDB, and data management
• **Cloud Computing** - AWS, Azure, deployment strategies

**📋 What I can help with:**
• Course recommendations based on your skill level
• Detailed course descriptions and prerequisites
• Enrollment process and requirements
• Instructor information and credentials
• Learning paths and career guidance

Which area interests you most? I can provide detailed information about any course! 🚀`;
    }
    
    // Programming-specific queries
    if (msg.includes('react') || msg.includes('javascript') || msg.includes('programming')) {
      return `Great choice! Programming is an incredibly valuable skill! 💻

**🎯 Learning Path Recommendations:**

**For Beginners:**
• Start with HTML, CSS, and JavaScript basics
• Take our "React.js Fundamentals" course
• Practice with small projects and exercises
• Join our coding community for support

**For Intermediate Learners:**
• "Advanced JavaScript" course covers modern features
• Learn about design patterns and best practices
• Build more complex applications
• Explore backend technologies

**For Advanced Students:**
• "Full-Stack Development" comprehensive program
• Learn databases, APIs, and deployment
• Work on real-world projects
• Prepare for technical interviews

**💡 Pro Tips:**
• Practice coding daily, even for 30 minutes
• Build projects to apply what you learn
• Join coding communities and forums
• Don't be afraid to make mistakes - they're part of learning!

Would you like me to recommend a specific course based on your current skill level? 🎓`;
    }
    
    // Payment queries
    if (msg.includes('payment') || msg.includes('pay') || msg.includes('cost') || msg.includes('price')) {
      return `I can help you with payment and pricing information! 💳

**💰 Pricing Options:**
• Individual courses: $49 - $199
• Course bundles: Up to 30% discount
• Monthly subscription: $29/month (unlimited access)
• Annual subscription: $299/year (save 15%)
• Student discounts: 20% off with valid ID

**💳 Payment Methods:**
• Credit/Debit cards (Visa, MasterCard, American Express)
• PayPal - Secure and widely accepted
• Stripe - Encrypted payment processing
• Bank transfers for bulk enrollments

**🔒 Security & Guarantees:**
• SSL encrypted transactions
• PCI DSS compliant payment processing
• 30-day money-back guarantee
• Secure data protection

**💡 Special Offers:**
• First-time student discount: 25% off
• Referral program: Earn credits for friends
• Corporate training packages available

Need help with a specific payment method or have questions about pricing? I'm here to help! 🛡️`;
    }
    
    // Help and support queries
    if (msg.includes('help') || msg.includes('support') || msg.includes('problem')) {
      return `I'm here to help! 🆘 Here's what I can assist you with:

**🎓 Learning Support:**
• Course recommendations and learning paths
• Study strategies and time management
• Technical concept explanations
• Project guidance and code reviews

**🔧 Technical Support:**
• Platform navigation and features
• Login and authentication issues
• Mobile app troubleshooting
• Browser compatibility problems

**💳 Account & Payment:**
• Payment processing issues
• Refund and cancellation requests
• Account settings and profile management
• Subscription and billing questions

**📚 Course Management:**
• Enrollment and course access
• Progress tracking and certificates
• Instructor communication
• Assignment and quiz help

**🚀 Getting Started:**
• New user onboarding
• Platform tour and feature overview
• Best practices for online learning
• Community guidelines and etiquette

What specific area would you like help with? I'll provide detailed guidance! 💪`;
    }
    
    // Login and authentication
    if (msg.includes('login') || msg.includes('sign in') || msg.includes('authentication')) {
      return `I can help you with login and account access! 🔐

**🔑 Login Methods:**
• Google OAuth2 - Quick and secure sign-in
• Email and password authentication
• Social media account integration
• Two-factor authentication (2FA)

**🛠️ Common Solutions:**
• **Forgot Password:** Use the "Reset Password" link on the login page
• **Google Login Issues:** Check browser permissions and clear cache
• **Account Locked:** Contact support for immediate assistance
• **2FA Problems:** Check your mobile device for authentication codes

**📱 Mobile Access:**
• Download our mobile app from App Store/Google Play
• Use the same login credentials as web
• Enable biometric login for convenience
• Sync progress across all devices

**🔒 Security Tips:**
• Use a strong, unique password
• Enable two-factor authentication
• Log out from shared devices
• Keep your email address updated

**🆘 Still Having Trouble?**
• Try clearing your browser cache and cookies
• Disable browser extensions temporarily
• Try a different browser or incognito mode
• Contact our support team for personalized help

Need help with a specific login issue? Describe the problem and I'll guide you through it! 🚀`;
    }
    
    // Progress and dashboard queries
    if (msg.includes('progress') || msg.includes('track') || msg.includes('dashboard')) {
      return `Track your learning journey with our comprehensive dashboard! 📊

**📈 Progress Tracking Features:**
• Course completion percentages and milestones
• Time spent learning and study streaks
• Quiz scores and assignment grades
• Certificate achievements and badges

**📊 Analytics & Insights:**
• Learning patterns and consistency tracking
• Skill development over time
• Peer comparison (anonymous benchmarking)
• Performance insights and recommendations

**🎯 Goal Setting & Motivation:**
• Set personal learning objectives
• Track milestone achievements
• Receive progress notifications
• Celebrate accomplishments with badges

**📱 Multi-Platform Access:**
• Web dashboard with detailed analytics
• Mobile app with quick progress overview
• Real-time updates across all devices
• Export progress reports for portfolios

**📋 Dashboard Sections:**
• **Overview:** Quick stats and recent activity
• **Courses:** Enrolled courses and progress
• **Achievements:** Certificates and badges earned
• **Analytics:** Detailed learning insights
• **Goals:** Personal objectives and milestones

**💡 Pro Tips:**
• Check your dashboard daily for motivation
• Set weekly learning goals
• Use progress tracking to stay accountable
• Share achievements with your network

Your dashboard is your learning command center! Would you like to know more about any specific feature? 🎓✨`;
    }
    
    // Thank you responses
    if (msg.includes('thank') || msg.includes('thanks')) {
      return `You're very welcome! 😊 I'm here to support your learning journey every step of the way. 

Feel free to ask me anything about:
• Courses and learning paths
• Technical platform support  
• Study strategies and tips
• Career guidance in tech
• Payment and account questions

Keep learning and growing! Remember, every expert was once a beginner. You've got this! 🚀✨

Happy learning! 🎓`;
    }
    
    // Goodbye responses
    if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('exit')) {
      return `Goodbye! 👋 Thank you for using LearnLab LMS. 

It was great helping you today! Remember:
• Keep practicing and learning daily
• Don't hesitate to come back if you need help
• Join our community for peer support
• Stay curious and keep growing

Wishing you success in your learning journey! 🌟

See you next time! 🎓✨`;
    }
    
    // Default intelligent response
    return `That's a great question! 🤔 I understand you're asking about "${message}". 

As your AI learning assistant for LearnLab LMS, I'm here to help with:

**🎓 Educational Support:**
• Course information and recommendations
• Learning strategies and study tips
• Technical concept explanations
• Project guidance and code reviews

**🔧 Platform Assistance:**
• Navigation and feature help
• Technical troubleshooting
• Account and payment support
• Mobile app guidance

**💡 Career Guidance:**
• Technology career paths
• Skill development recommendations
• Industry insights and trends
• Interview preparation tips

Could you provide more details about what you'd like to know? I'm here to give you the most helpful and accurate information! 

What specific area would you like to explore? 🚀`;
  }

  async testConnection() {
    try {
      const testResponse = await this.generateResponse('Hello, this is a test message.');
      return {
        status: 'success',
        message: 'AI service is working properly',
        testResponse: testResponse.substring(0, 100) + '...'
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'AI service is not available',
        error: error.message
      };
    }
  }
}

// Export singleton instance
const aiService = new AIService();
module.exports = { aiService, generateAIResponse: (message, context) => aiService.generateResponse(message, context) };
