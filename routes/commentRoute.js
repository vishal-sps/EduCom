const { Router } = require('express');
const {  verifyToken } = require('../middleware/verifyUser');
const isAdmin = require('../middleware/isAdmin');
const { createComment, getCommentsByVideoId, updateCommentById, addReplyToComment, deleteReplyFromComment } = require('../controller/commentController');
const commentRouter = Router();



// commentRouter.get("/", getAllCategories);
commentRouter.get("/:videoId", getCommentsByVideoId);
commentRouter.post("/create",verifyToken,isAdmin, createComment)
commentRouter.put("/update/:commentId",verifyToken ,updateCommentById);
commentRouter.post("/reply/:commentId",verifyToken ,addReplyToComment);
commentRouter.delete("/delete/:commentId/:replyId", verifyToken, deleteReplyFromComment);
// commentRouter.delete("/delete/:id", dele)
// commentRouter.delete("/deleteAll", deleteAllCategory)




module.exports = commentRouter;
