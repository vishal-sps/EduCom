const { Router } = require('express');
const { signup, getAllUsers, login,updateUser, forgotPassword, resetPassword, verifyUserOTP } = require('../controller/userController');
const {  verifyToken } = require('../middleware/verifyUser');
// import verifyUser from "../middleware/userVerify.js";
const userRouter = Router();



userRouter.get("/", getAllUsers);
userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.put("/update/:id",verifyToken ,updateUser)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password", resetPassword)
userRouter.post("/verify",verifyUserOTP)


module.exports = userRouter;
