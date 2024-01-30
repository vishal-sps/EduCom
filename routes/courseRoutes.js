const { Router } = require('express');
const {  verifyToken } = require('../middleware/verifyUser');
const isAdmin = require('../middleware/isAdmin');
const { createCourse, getCourseById, getAllCourses, updateCourseById, deleteCourseById } = require('../controller/courseController');
const isTeacher = require('../middleware/isTeacher');
const courseRouter = Router();



courseRouter.get("/getAll", verifyToken,getAllCourses);
courseRouter.get("/:id", getCourseById);
courseRouter.post("/",verifyToken,isTeacher, createCourse)
courseRouter.put("/update/:id",updateCourseById)
courseRouter.delete("/delete/:id", deleteCourseById)
// courseRouter.delete("/deleteAll", deleteAllCourse)


module.exports = courseRouter;
