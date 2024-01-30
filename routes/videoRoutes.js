const { Router } = require('express');
const {  verifyToken } = require('../middleware/verifyUser');
const isAdmin = require('../middleware/isAdmin');
const { createVideo, getAllVideo, updateReaction, deleteVideoById,  } = require('../controller/videoController');
const isTeacher = require('../middleware/isTeacher');
const videoRouter = Router();



videoRouter.get("/getAll", verifyToken,getAllVideo);
// videoRouter.get("/:id", getvideoById);
videoRouter.post("/",verifyToken,isTeacher, createVideo)
videoRouter.put("/update-reaction",verifyToken, updateReaction)
videoRouter.delete("/delete/:id", deleteVideoById)
// videoRouter.delete("/deleteAll", deleteAllvideo)




module.exports = videoRouter;
