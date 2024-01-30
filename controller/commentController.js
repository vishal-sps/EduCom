const { default: mongoose } = require('mongoose');
const Comment = require('../models/comments');
const User = require('../models/user');
const Video = require('../models/video');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const userId = req.user.userId
    const { videoId, comment } = req.body;

    // Check if the user and video exist
    const user = await User.findById(userId);
    const video = await Video.findById(videoId);

    if (!user || !video) {
      return res.status(404).json({ message: 'User or Video not found' });
    }

    const newComment = new Comment({
      userId,
      videoId,
      comment,
    });

    const savedComment = await newComment.save();

    res.status(201).json({ message: 'Comment created successfully', comment: savedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all comments for a specific video
const getCommentsByVideoId = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    console.log('videoId', videoId);
    // Fetch comments for the given video
    const comments = await Comment.find({ videoId }); // Assuming User model has a 'username' field
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a comment by its ID
const updateCommentById = async (req, res) => {
  try {

    const commentId = req.params.commentId;

    const { comment } = req.body;
     // Validate if the provided commentId is a valid ObjectId
  if (!mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ message: 'Invalid commentId format' });
  }
    const commentData = await Comment.findById(commentId)
    if (!commentData) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    console.log("userId",commentData, commentData?.userId,req.user.userId, );
    if(commentData.userId.toString() !== req.user.userId){
      return res.status(401).json({message: "Unauthorised. You are not the owner of comment."})
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { comment },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a comment by its ID
const deleteCommentById = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // Find the comment and its associated user and video
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const addReplyToComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId; 

  try {
    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({ message: 'Invalid commentId format' });
    }
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    const newReply = {
      userId: userId,
      comment: req.body.replyOnComment, 
    };

    existingComment.replies.push(newReply);
    const updatedComment = await existingComment.save();
    res.status(201).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const deleteReplyFromComment = async (req, res) => {
  const { commentId, replyId } = req.params;
  const userId = req.user.userId; 

  try {

    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const replyIndex = existingComment.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );

    if (replyIndex === -1) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if the user making the request is the same user who created the reply
    if (existingComment.replies[replyIndex].userId.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this reply' });
    }

    existingComment.replies.splice(replyIndex, 1);

    const updatedComment = await existingComment.save();

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createComment, getCommentsByVideoId, updateCommentById, deleteCommentById , addReplyToComment, deleteReplyFromComment};
