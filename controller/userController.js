const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/email");
const { generateOTP } = require("../utils/otp");

async function signup(req, res) {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    if (
      !firstName &&
      firstName.trim() === "" &&
      !lastName &&
      lastName.trim() === "" &&
      !email &&
      email.trim() === "" &&
      !password &&
      password.trim() === ""
    ) {
      return res.status(422).json({ message: "Invalid inputs" });
    }
    const existingUser = await User.findOne({ email });


    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email", email: email });
    }
    let newRole = role ? role : "student";
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: newRole,
    });
    let new_otp = generateOTP()
    let emailInfo =   await sendMail(email,'Verify Email.', {
      firstName:firstName ,
      OTP: new_otp,
      useCase:'email verification'
    })
    
if(emailInfo?.messageId){
  newUser.email_otp = new_otp;
  await newUser.save();
  return res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
}else{
  return res.status(400).json({
    message: 'Please provide a valid emailID' 
  })
}
   
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Signup failed", error: error.message });
  }
}




async function verifyUserOTP(req, res) {
  const { email, OTP } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }
    // Check if the entered OTP matches the stored OTP
    if (user.email_otp === OTP) {
      // OTP is valid, you can perform further actions here (e.g., mark the user as verified)
      console.log('OTP is valid. User verified!');
      // Clear the OTP after successful verification if needed
      user.email_otp = "";
      user.isVerified = true
      await user.save();
      return res
    .status(200)
    .json( { success: true, message: 'User verified successfully', user })
    } else {
      console.log('Invalid OTP. User verification failed.');
      return res.status(200).json({ success: false, message: 'Invalid OTP. User verification failed.' });
    }
  } catch (error) {
    console.error('Error verifying user:', error.message);
    return res.status(400).json({ success: false, message: 'Error verifying user' });
  }
}



async function getAllUsers(req, res) {
  try {
    const {role} = req.query
    console.log("role", role);
    const obj = {};
    if(role){
      obj.role = role
    }
    let allUsers = await User.find(obj).select(["-password", "-email_otp", "-__v"]);
    console.log("allUsers", allUsers);
    return res.status(200).json({ allUsers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot get users", error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
   
    const isUserVerified = user.isVerified;
    if(isUserVerified){
      const token = jwt.sign({ userId: user._id, role:user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      return res.status(200).json({ message: "Login successful", user, token });
    }else{
      return res.status(200).json({message: "User email is not verified yet."})
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
}

const updateUser = async (req, res) => {
  try {
    const { password, firstName, lastName, role } = req.body;
    const { id } = req.params;
    let updateObj = {};

    if (firstName && firstName.trim() !== "") {
      updateObj.firstName = firstName;
    }
    if (role && role.trim() !== "") {
      updateObj.role = role;
    }

    if (lastName && lastName.trim() !== "") {
      updateObj.lastName = lastName;
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Password updated successfully", updatedUser });
    }
    if (!updateObj.firstName && !updateObj.lastName && !updateObj.role) {
      return res.status(400).json({
        message:
          "At least one field (firstName or lastName ) must be provided",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateObj, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "User details updated successfully", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: error });
  }
};

const forgotPassword = async (req, res) => {
    const {email} = req.body
  try {
    if(!email){
        return res.status(400).json({
            message:
              "Please provide email to proceed.",
          });
    }
    
    const user = await User.findOne({ email });
    if(user){
      const new_OTP = generateOTP()
      const emailResponse = await sendMail(email, 'Reset Password OTP', {
        firstName: user.firstName,
        OTP : new_OTP,
        useCase: 'resetting password'
    })
     await User.findByIdAndUpdate(
      user._id,
      { email_otp: new_OTP },
    );    

    if(emailResponse?.messageId){
      return res.status(200).json({status: true, message: "OTP sent successfully on email, please verify it."})
    }else{
      console.log("email Response", emailResponse);
      return res.status(200).json({status: false, message: "Something wrong, can't sent email"})
    }
  }
    else{
      return res.status(400).json({status: false, message: "Email doesn't exist in database"})
    }
    
    
  } catch (error) {
    return res.status(400).json({status: false, message: error})
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, OTP, password } = req.body;

    const user = await User.findOne({ email, email_otp: OTP });

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or OTP.' });
    }

    user.email_otp = "";

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports = {
  signup,
  verifyUserOTP,
  getAllUsers,
  login,
  updateUser,
  forgotPassword,
  resetPassword,
};
