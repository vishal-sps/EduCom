const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  isVerified: {
    type: Boolean,
    default: false
   },
  email_otp: Number,
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student', 
  },
 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
