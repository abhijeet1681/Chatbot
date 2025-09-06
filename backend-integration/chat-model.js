const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  aiResponse: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null,
    index: true
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  contextType: {
    type: String,
    enum: ['general', 'course_specific', 'technical_support', 'payment', 'enrollment'],
    default: 'general'
  },
  sources: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  isHelpful: {
    type: Boolean,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ conversationId: 1, createdAt: 1 });
chatSchema.index({ courseId: 1, createdAt: -1 });

// Virtual for conversation summary
chatSchema.virtual('conversationSummary').get(function() {
  return {
    id: this.conversationId,
    messageCount: 1, // This would be calculated in aggregation
    lastMessage: this.message,
    lastResponse: this.aiResponse,
    lastActivity: this.createdAt
  };
});

// Method to get conversation context
chatSchema.methods.getContext = function() {
  return {
    userId: this.userId,
    courseId: this.courseId,
    conversationId: this.conversationId,
    contextType: this.contextType
  };
};

// Static method to get conversation history
chatSchema.statics.getConversationHistory = function(conversationId, limit = 50) {
  return this.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .populate('courseId', 'title courseCode instructor')
    .select('message aiResponse courseId contextType sources createdAt');
};

// Static method to get user chat statistics
chatSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        totalConversations: { $addToSet: '$conversationId' },
        averageRating: { $avg: '$rating' },
        helpfulResponses: { $sum: { $cond: ['$isHelpful', 1, 0] } },
        lastActivity: { $max: '$createdAt' }
      }
    },
    {
      $project: {
        totalMessages: 1,
        totalConversations: { $size: '$totalConversations' },
        averageRating: { $round: ['$averageRating', 2] },
        helpfulResponses: 1,
        lastActivity: 1
      }
    }
  ]);
};

// Pre-save middleware
chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-detect context type based on message content
  const message = this.message.toLowerCase();
  if (message.includes('course') || message.includes('enroll')) {
    this.contextType = 'enrollment';
  } else if (message.includes('pay') || message.includes('payment') || message.includes('cost')) {
    this.contextType = 'payment';
  } else if (message.includes('help') || message.includes('problem') || message.includes('error')) {
    this.contextType = 'technical_support';
  } else if (this.courseId) {
    this.contextType = 'course_specific';
  }
  
  next();
});

// Post-save middleware for analytics
chatSchema.post('save', function(doc) {
  // You can add analytics tracking here
  console.log(`New chat message saved: ${doc._id}`);
});

module.exports = mongoose.model('Chat', chatSchema);
