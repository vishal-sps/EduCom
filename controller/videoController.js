const { uploadVideo, deleteVideo } = require('../helper/upload');
const User = require('../models/user');
const Video = require('../models/video'); // Import your Video model
// Import your video upload function

// Create a new video
exports.createVideo = async (req, res) => {
  try {
    const { name, course, availability_type } = req.body;

    // Assuming you have user authentication middleware and user information in req.user
    const userId = req.user.userId;

    // Assuming you are using req.files for video uploads
    if (!req.files || !req.files.video) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const videoFile = req.files.video;

    const { video_url, public_id } = await uploadVideo(videoFile, 'course_videos'); // Adjust the folder name as needed

    const newVideo = new Video({
      name,
      url: video_url,
      public_id: public_id,
      course,
      availability_type,
      userId
    });

    await newVideo.save();

    res.status(201).json({ message: 'Video created successfully!', video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllVideo = async(req, res)=>{
  try {
    let allVideo = await Video.find({})
    return res.status(200).json({allVideo: allVideo})
  } catch (error) {
    res.status(500).json({error: error})
  }
}

exports.getVideoById = async(req, res)=>{
  try {
    
  } catch (error) {
    
  }
}

exports.updateReaction = async(req, res)=>{
  try {
    const { videoId, reactionType } = req.body;
    const userId = req.user.userId;
    const video = await Video.findById(videoId);
    console.log("video", video, videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if the user has already liked or disliked the video
    const existingLikeIndex = user.likes.findIndex((like) => like.toString() === videoId);
    const existingDislikeIndex = user.dislikes.findIndex((dislike) => dislike.toString() === videoId);
    // Update user's likes and dislikes based on the incoming reactionType
    if (existingLikeIndex !== -1 && reactionType === 'dislike') {
      // If the user already liked the video and is now disliking it, update likes and dislikes
      user.likes.splice(existingLikeIndex, 1);
      user.dislikes.push(videoId);
      video.totalLikes -= 1;
      video.totalDislikes += 1;
    } else if (existingDislikeIndex !== -1 && reactionType === 'like') {
      // If the user already disliked the video and is now liking it, update likes and dislikes
      user.dislikes.splice(existingDislikeIndex, 1);
      user.likes.push(videoId);
      video.totalLikes += 1;
      video.totalDislikes -= 1;
    } else {
      // If the user is reacting for the first time, update likes and dislikes accordingly
      if (reactionType === 'like') {
        user.likes.push(videoId);
        video.totalLikes += 1;
      } else if (reactionType === 'dislike') {
        user.dislikes.push(videoId);
        video.totalDislikes += 1;
      }
    }
    // Save the updated user and video documents
    await user.save();
    await video.save();
    res.status(200).json({ message: 'Reactions updated successfully', video });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' , error:error});
  }
}

exports.deleteVideoById = async(req, res)=>{
  try {
    const {id} = req.params
    const video  = await Video.findByIdAndDelete(id);
    if(!video){
      return res.status(400).json({message:'Video Not Found'})
    }
    await deleteVideo(video.public_id)
    return res.status(200).json({message:'Video Deleted Successfully'})
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' , error});
  }
}
