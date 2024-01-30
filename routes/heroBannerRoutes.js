const { Router } = require('express');
const {  verifyToken } = require('../middleware/verifyUser');
const isAdmin = require('../middleware/isAdmin');
const { createHeroBanner, getAllHeroBanner, updateHeroBannerById, deleteHeroBannerById, getHeroBannerById,  } = require('../controller/heroController');
const heroRouter = Router();



heroRouter.get("/getAll",getAllHeroBanner);
heroRouter.get("/getBanner/:id",getHeroBannerById);
heroRouter.post("/create",verifyToken,isAdmin, createHeroBanner);
heroRouter.put("/update/:id",verifyToken,isAdmin,updateHeroBannerById);
heroRouter.delete("/:id", verifyToken,isAdmin,deleteHeroBannerById)
// heroRouter.delete("/deleteAll", deleteAllCourse)

module.exports = heroRouter;
