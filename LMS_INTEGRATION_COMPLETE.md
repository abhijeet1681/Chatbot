# LearnLab LMS AI Chatbot Integration Guide

This guide explains how to integrate the AI Chatbot component into your existing LearnLab LMS project from [GitHub Repository](https://github.com/abhijeet1681/LMS2.git).

## 🎯 Overview

The AI Chatbot is designed to work seamlessly with your LearnLab LMS features:
- **Course Management**: React.js, Redux Toolkit, Tailwind CSS
- **Authentication**: Google OAuth2, JWT tokens
- **Payment Integration**: Stripe payments
- **Real-time Communication**: Socket.io
- **Database**: MongoDB with Mongoose

## 📁 Files to Copy to Your LMS Project

### 1. Frontend Components
Copy these files to your LMS `frontend/src/` directory:

```
src/
├── components/
│   └── chat/
│       ├── ChatInterface.tsx
│       ├── DocumentSources.tsx
│       └── MessageBubble.tsx
├── pages/
│   └── AIChatPage.tsx
├── services/
│   └── aiChatService.ts
└── types/
    └── index.ts (update existing)
```

### 2. Environment Configuration
Add to your LMS `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=1963074662-kmhpfe03is13pdr8vp0qeskjiq5mrloa.apps.googleusercontent.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RYOLAQfJsaPdcpZ9QG3veM4o1XbtVIIvJolLhVRfFVIwrczlh8i8qPAjHt2FJZD2UKubUYurTuSXqARdKKgImxm00iGbzX6KI
VITE_GOOGLE_API_KEY=your_gemini_api_key_here
```

## 🔧 Integration Steps

### Step 1: Copy Files
```bash
# Copy chatbot components
cp -r src/components/chat/ your-lms-project/frontend/src/components/
cp src/pages/AIChatPage.tsx your-lms-project/frontend/src/pages/
cp src/services/aiChatService.ts your-lms-project/frontend/src/services/
```

### Step 2: Install Dependencies
Add to your LMS `frontend/package.json`:

```json
{
  "dependencies": {
    "lucide-react": "^0.263.1"
  }
}
```

### Step 3: Add Route
In your LMS router (likely `frontend/src/App.tsx` or router file):

```tsx
import { AIChatPage } from './pages/AIChatPage';

// Add route
<Route path="/ai-chat" element={<AIChatPage />} />
```

### Step 4: Add Navigation Link
In your navigation component:

```tsx
import { MessageCircle } from 'lucide-react';

// Add to navigation menu
<Link to="/ai-chat" className="flex items-center space-x-2">
  <MessageCircle className="w-5 h-5" />
  <span>AI Assistant</span>
</Link>
```

## 🚀 Backend Integration

### Step 1: Add Chat Routes
Create `backend/routes/chat.js`:

```javascript
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { authenticateToken } = require('../middleware/auth');

// Send message to AI
router.post('/send-message', authenticateToken, async (req, res) => {
  try {
    const { message, courseId, conversationId } = req.body;
    const userId = req.user.id;

    // Call your AI service (Gemini, OpenAI, etc.)
    const aiResponse = await generateAIResponse(message);

    // Save to database
    const chat = new Chat({
      userId,
      message,
      aiResponse,
      courseId,
      conversationId: conversationId || generateConversationId()
    });

    await chat.save();

    res.json({
      success: true,
      response: aiResponse,
      conversationId: chat.conversationId
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get chat history
router.get('/history/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### Step 2: Add Chat Model
Create `backend/models/Chat.js`:

```javascript
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  aiResponse: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  conversationId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);
```

### Step 3: Add AI Service
Create `backend/services/aiService.js`:

```javascript
// Example using OpenAI (you can replace with Gemini)
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAIResponse(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant for LearnLab LMS. Help students with courses, learning, and technical support."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again.";
  }
}

module.exports = { generateAIResponse };
```

## 🎨 Customization for Your LMS

### 1. Update Branding
In `AIChatPage.tsx`, update the branding:

```tsx
<h1 className="text-2xl font-bold text-gray-900">LearnLab LMS</h1>
<p className="text-sm text-gray-600">AI Learning Assistant</p>
```

### 2. Add Course Integration
Update the AI service to include real course data:

```tsx
// In aiChatService.ts, add course data from your API
const courses = await fetch(`${this.baseUrl}/courses`).then(r => r.json());
```

### 3. Add User Context
Integrate with your existing user authentication:

```tsx
// Get user from your auth context
const { user } = useAuth();
const userId = user?.id || 1;
```

## 🔒 Security Considerations

1. **Authentication**: All chat endpoints require valid JWT tokens
2. **Rate Limiting**: Implement rate limiting for chat requests
3. **Input Validation**: Validate and sanitize user inputs
4. **API Keys**: Store AI API keys securely in environment variables

## 📱 Mobile Responsiveness

The chatbot is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices
- Progressive Web App (PWA) if your LMS supports it

## 🧪 Testing

Test the integration with these queries:

```
"Hello, I'm new to LearnLab"
"Show me available courses"
"How do I enroll in a course?"
"What payment methods do you accept?"
"Help me with login issues"
"Tell me about React.js course"
```

## 🚀 Deployment

### Frontend Deployment
1. Build your LMS frontend: `npm run build`
2. Deploy to your hosting platform
3. Update environment variables in production

### Backend Deployment
1. Deploy your LMS backend with new chat routes
2. Set up AI API keys in production environment
3. Configure database for chat storage

## 📞 Support

The AI chatbot provides support for:
- **Course Information**: Detailed course descriptions and enrollment
- **Technical Support**: Platform navigation and troubleshooting
- **Learning Guidance**: Study tips and learning strategies
- **Payment Help**: Payment methods and pricing information
- **General Questions**: Any LMS-related inquiries

## 🎉 Ready to Use!

Your AI chatbot is now integrated with LearnLab LMS and ready to provide intelligent assistance to students and instructors. The chatbot will help users navigate courses, get technical support, and receive learning guidance - all while maintaining the professional look and feel of your LMS platform.

## 📋 Checklist

- [ ] Copy frontend components to LMS project
- [ ] Install required dependencies
- [ ] Add environment variables
- [ ] Create backend chat routes
- [ ] Add chat model to database
- [ ] Integrate AI service
- [ ] Add navigation links
- [ ] Test functionality
- [ ] Deploy to production

Your LearnLab LMS now has a powerful AI assistant! 🎓✨
