const { Router } = require('express');
const { chatAI, uploadfiles, listfiles, fineTune, transcribe } = require('../controller/openaiController');
const chatRouter = Router();



chatRouter.get("/", chatAI);
chatRouter.post("/upload", uploadfiles);
chatRouter.get("/list", listfiles);
chatRouter.post("/finetune", fineTune)
chatRouter.post("/transcribe", transcribe)




module.exports = chatRouter;
