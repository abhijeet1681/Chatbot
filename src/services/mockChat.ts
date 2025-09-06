import type { ChatMessage, ChatResponse } from '../types';

class LMSMockChatService {
  private courseDatabase = [
    { id: 1, title: "React.js Fundamentals", instructor: "Dr. Sarah Johnson", duration: "8 weeks", level: "Beginner" },
    { id: 2, title: "Advanced JavaScript", instructor: "Prof. Mike Chen", duration: "12 weeks", level: "Intermediate" },
    { id: 3, title: "Full-Stack Development", instructor: "Dr. Emily Rodriguez", duration: "16 weeks", level: "Advanced" },
    { id: 4, title: "Database Design", instructor: "Prof. David Kim", duration: "6 weeks", level: "Beginner" },
    { id: 5, title: "Cloud Computing", instructor: "Dr. Lisa Wang", duration: "10 weeks", level: "Intermediate" }
  ];

  private lmsFeatures = [
    "Course enrollment and management",
    "Real-time chat with peers and instructors", 
    "Progress tracking and analytics",
    "Secure payment processing with PayPal/Stripe",
    "Google OAuth2 authentication",
    "Dark/Light mode themes",
    "File uploads and course materials",
    "User dashboard and profile management"
  ];

  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate a conversation ID if not provided
    const conversationId = message.conversation_id || `lms_conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create a contextual response based on the user's message
    const userMessage = message.message.toLowerCase();
    let response = this.generateLMSResponse(userMessage);

    // Add relevant course sources when discussing courses
    const sources = this.getRelevantSources(userMessage);

    return {
      response,
      conversation_id: conversationId,
      sources
    };
  }

  private generateLMSResponse(userMessage: string): string {
    // LMS-specific greetings
    if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      return "Hello! Welcome to LearnLab LMS! I'm your AI learning assistant. I can help you with course information, enrollment, technical support, and learning guidance. How can I assist you today?";
    }
    
    // Course-related queries
    if (userMessage.includes('course') || userMessage.includes('enroll') || userMessage.includes('class')) {
      return this.getCourseInformation();
    }
    
    if (userMessage.includes('react') || userMessage.includes('javascript') || userMessage.includes('programming')) {
      return this.getProgrammingCourseInfo(userMessage);
    }
    
    // LMS features and help
    if (userMessage.includes('help') || userMessage.includes('support') || userMessage.includes('how')) {
      return this.getLMSHelp();
    }
    
    if (userMessage.includes('payment') || userMessage.includes('pay') || userMessage.includes('checkout')) {
      return "Our LMS supports secure payments through PayPal and Stripe integration. You can add courses to your cart and checkout safely. All transactions are encrypted and secure. Need help with a specific payment issue?";
    }
    
    if (userMessage.includes('login') || userMessage.includes('sign in') || userMessage.includes('authentication')) {
      return "You can sign in using Google OAuth2 for secure authentication. Our system uses JWT tokens for session management. If you're having trouble logging in, please check your Google account permissions or contact support.";
    }
    
    if (userMessage.includes('progress') || userMessage.includes('track') || userMessage.includes('dashboard')) {
      return "Track your learning progress through our comprehensive dashboard! You can view enrolled courses, completion status, grades, and learning analytics. The dashboard provides insights into your learning journey and helps you stay motivated.";
    }
    
    if (userMessage.includes('chat') || userMessage.includes('discussion') || userMessage.includes('message')) {
      return "Our real-time chat feature allows you to communicate with peers and instructors instantly using Socket.io technology. You can join course discussions, ask questions, and collaborate on projects in real-time.";
    }
    
    if (userMessage.includes('theme') || userMessage.includes('dark') || userMessage.includes('light') || userMessage.includes('mode')) {
      return "Our LMS supports both dark and light themes! You can switch between themes manually or let the system automatically adjust based on your device preferences. The theme settings are saved to your profile.";
    }
    
    if (userMessage.includes('admin') || userMessage.includes('instructor') || userMessage.includes('teacher')) {
      return "Instructors and admins have access to powerful management tools including course creation, user management, analytics dashboard, and content moderation. They can track student progress and manage the learning environment effectively.";
    }
    
    if (userMessage.includes('mobile') || userMessage.includes('responsive') || userMessage.includes('phone')) {
      return "Our LMS is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile. The interface adapts to your screen size for the best learning experience anywhere, anytime.";
    }
    
    if (userMessage.includes('thank') || userMessage.includes('thanks')) {
      return "You're very welcome! I'm here to help make your learning journey smooth and enjoyable. Feel free to ask me anything about courses, features, or technical support. Happy learning!";
    }
    
    if (userMessage.includes('bye') || userMessage.includes('goodbye') || userMessage.includes('exit')) {
      return "Goodbye! Thank you for using LearnLab LMS. Keep learning and growing! If you need any help later, just come back and chat with me. Have a great day!";
    }
    
    // Default LMS response
    return this.getDefaultLMSResponse(userMessage);
  }

  private getCourseInformation(): string {
    const courses = this.courseDatabase.slice(0, 3);
    let response = "Here are some popular courses available in our LMS:\n\n";
    
    courses.forEach(course => {
      response += `📚 **${course.title}**\n`;
      response += `   👨‍🏫 Instructor: ${course.instructor}\n`;
      response += `   ⏱️ Duration: ${course.duration}\n`;
      response += `   📊 Level: ${course.level}\n\n`;
    });
    
    response += "You can browse all courses, read detailed descriptions, and enroll directly from the course catalog. Would you like to know more about any specific course?";
    
    return response;
  }

  private getProgrammingCourseInfo(userMessage: string): string {
    if (userMessage.includes('react')) {
      return "**React.js Fundamentals** is perfect for beginners! This 8-week course covers:\n\n• Component-based architecture\n• JSX and virtual DOM\n• State and props management\n• Hooks and functional components\n• Routing and navigation\n• State management with Redux\n\nTaught by Dr. Sarah Johnson, this course includes hands-on projects and real-world applications. Ready to start your React journey?";
    }
    
    if (userMessage.includes('javascript')) {
      return "**Advanced JavaScript** is an intermediate course that dives deep into:\n\n• ES6+ features and modern syntax\n• Asynchronous programming (Promises, async/await)\n• Closures and scope\n• Prototypes and inheritance\n• Design patterns\n• Performance optimization\n\nProf. Mike Chen's 12-week program includes advanced projects and industry best practices. Perfect for developers looking to master JavaScript!";
    }
    
    return "Our programming courses cover everything from fundamentals to advanced concepts. We offer courses in React.js, JavaScript, Full-Stack Development, and more. Each course includes practical projects, code reviews, and instructor support. Which programming language or framework interests you most?";
  }

  private getLMSHelp(): string {
    return `**LearnLab LMS Help Center** 🎓\n\nI can assist you with:\n\n📚 **Course Management**\n• Browse and enroll in courses\n• Track your learning progress\n• Access course materials\n\n💬 **Communication**\n• Real-time chat with peers and instructors\n• Course discussions and Q&A\n\n💳 **Payments**\n• Secure checkout with PayPal/Stripe\n• Course pricing and discounts\n\n🔐 **Account**\n• Google OAuth2 login\n• Profile management\n• Theme preferences (Dark/Light mode)\n\n📱 **Technical Support**\n• Mobile-responsive design\n• Cross-platform compatibility\n• Performance optimization\n\nWhat specific area would you like help with?`;
  }

  private getDefaultLMSResponse(userMessage: string): string {
    const responses = [
      "That's a great question about our LMS! Let me help you with that. Our platform offers comprehensive learning management with features like course enrollment, real-time chat, progress tracking, and secure payments.",
      "I understand you're asking about our learning platform. LearnLab LMS provides a complete educational experience with modern features and user-friendly interface.",
      "Excellent question! Our LMS is designed to make learning interactive and engaging. We offer various courses, real-time communication, and detailed progress tracking.",
      "I'm here to help with any LMS-related questions! Whether it's about courses, features, technical support, or learning guidance, I've got you covered.",
      "That's an interesting topic! Our learning management system is built with modern technologies like React, Node.js, and MongoDB to provide the best learning experience."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse} Could you be more specific about what you'd like to know? I can help with courses, enrollment, technical issues, or any other LMS features.`;
  }

  private getRelevantSources(userMessage: string): string[] | undefined {
    if (userMessage.includes('course') || userMessage.includes('react') || userMessage.includes('javascript')) {
      return [
        "Course Catalog: Programming Courses.pdf",
        "React.js Course Syllabus.docx", 
        "JavaScript Learning Path.pdf",
        "Course Enrollment Guide.pdf"
      ];
    }
    
    if (userMessage.includes('payment') || userMessage.includes('checkout')) {
      return [
        "Payment Processing Guide.pdf",
        "Stripe Integration Documentation.pdf",
        "PayPal Setup Instructions.pdf"
      ];
    }
    
    if (userMessage.includes('help') || userMessage.includes('support')) {
      return [
        "LMS User Manual.pdf",
        "FAQ Document.pdf",
        "Technical Support Guide.pdf"
      ];
    }
    
    return undefined;
  }

  async getChatHistory(): Promise<{ chats: any[] }> {
    // Return empty history for mock
    return { chats: [] };
  }

  async testChatService(): Promise<any> {
    return { status: 'ok', message: 'Mock chat service is working!' };
  }
}

export const mockChatService = new MockChatService();
