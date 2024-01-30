const mongoose = require("mongoose");
const { Schema } = mongoose;

const videoSchema = new mongoose.Schema({
  name: String,
  url: String,
  public_id: String,
  totalLikes: { type: Number, default: 0 },
  totalDislikes: { type: Number, default: 0 },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  availability_type: {
    type: String,
    enum: ["paid", "free"],
    default: "free",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
 
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
