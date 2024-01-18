const { Router } = require('express');
const {  verifyToken } = require('../middleware/verifyUser');
const { createCategory, getAllCategories, updateCategoryById, deleteCategoryById, deleteAllCategory, getCategoryById } = require('../controller/categoryController');
const isAdmin = require('../middleware/isAdmin');
const categoryRouter = Router();



categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.post("/",verifyToken,isAdmin, createCategory)
categoryRouter.put("/update/:id",verifyToken ,updateCategoryById)
categoryRouter.delete("/delete/:id", deleteCategoryById)
categoryRouter.delete("/deleteAll", deleteAllCategory)




module.exports = categoryRouter;
