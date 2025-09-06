const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { authenticateToken } = require('../middleware/auth');
const { generateAIResponse } = require('../services/aiService');

// Send message to AI
router.post('/send-message', authenticateToken, async (req, res) => {
  try {
    const { message, courseId, conversationId } = req.body;
    const userId = req.user.id;

    // Generate AI response
    const aiResponse = await generateAIResponse(message);

    // Generate conversation ID if not provided
    const convId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save to database
    const chat = new Chat({
      userId,
      message,
      aiResponse,
      courseId: courseId || null,
      conversationId: convId
    });

    await chat.save();

    res.json({
      success: true,
      response: aiResponse,
      conversationId: convId,
      chatId: chat._id,
      timestamp: chat.createdAt
    });
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process message',
      message: 'I\'m sorry, I\'m having trouble processing your request right now. Please try again.'
    });
  }
});

// Get chat history for user
router.get('/history/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, conversationId } = req.query;

    let query = { userId };
    if (conversationId) {
      query.conversationId = conversationId;
    }

    const chats = await Chat.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('courseId', 'title courseCode')
      .select('message aiResponse courseId conversationId createdAt');

    res.json({ 
      success: true, 
      chats: chats.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chat history' 
    });
  }
});

// Get conversations for user
router.get('/conversations/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Chat.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $last: '$message' },
          lastResponse: { $last: '$aiResponse' },
          messageCount: { $sum: 1 },
          lastActivity: { $max: '$createdAt' },
          courseId: { $last: '$courseId' }
        }
      },
      { $sort: { lastActivity: -1 } },
      { $limit: 20 }
    ]);

    res.json({ 
      success: true, 
      conversations 
    });
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch conversations' 
    });
  }
});

// Clear chat history
router.delete('/clear/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { conversationId } = req.query;

    let query = { userId };
    if (conversationId) {
      query.conversationId = conversationId;
    }

    await Chat.deleteMany(query);

    res.json({ 
      success: true, 
      message: 'Chat history cleared successfully' 
    });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to clear chat history' 
    });
  }
});

// Test AI connection
router.get('/test', async (req, res) => {
  try {
    const testResponse = await generateAIResponse('Hello, this is a test message.');
    res.json({ 
      success: true, 
      message: 'AI service is working',
      testResponse 
    });
  } catch (error) {
    console.error('AI test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'AI service is not available',
      message: error.message 
    });
  }
});

module.exports = router;
