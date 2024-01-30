const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
    required: true,
  },  
  replies: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
