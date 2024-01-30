const mongoose = require("mongoose");
const { Schema } = mongoose;

const course = new Schema({
  course_name: {
    type: String,
    required: true,
  },
  thumbnail_img: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  course_description: {
    type: String,
  },
  duration_in_minutes: {
    type: Number,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  price: {
    type: Number,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Course = mongoose.model("Course", course);

module.exports = Course;
