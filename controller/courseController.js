const Course = require("../models/course")
const {uploadImage, updateImage}  = require('../helper/upload');

exports.createCourse = async (req, res) => {
    const {
      course_name,
      duration_in_minutes,
      price,
      category,
      description,
    } = req.body;
    const {thumbnail_img} = req.files
    const {img_url, public_id} = await uploadImage(thumbnail_img, "course");
    // Check if all required fields are present in the request body
    if (!course_name || !duration_in_minutes || !price || !category) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
  
    try {
      const newCourse = await Course.create({...req.body, author: req.user.userId,thumbnail_img:{public_id:public_id, url:img_url}});
      res.status(201).json(newCourse);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  exports.getCourseById = async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId).populate([{path: 'author', select: ['-password', '-__v']},, {path: 'category', select:['-image_public_id', '-__v']}]); // Populate category field
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.getAllCourses = async (req, res) => {
    try {
      const course = await Course.find({}); 
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // UPDATE - Update a course by ID
  exports.updateCourseById = async (req, res) => {
    const {
      course_name,
      duration_in_minutes,
      author,
      price,
      category,
      description
    } = req.body;
    try {
      const courseId = req.params.id;
      if(req.files?.thumbnail_img){
        const course = await Course.findById(courseId); 
        const {img_url, public_id} = await updateImage(req.files?.thumbnail_img,course.thumbnail_img.public_id)
      }
      const updatedCourse = await Course.findByIdAndUpdate(courseId,{
        course_name,
        duration_in_minutes,
        author,
        price,
        category,
        description}, {
        new: true,
      });
      if (!updatedCourse) {
        return res.status(404).json({ message: 'Course not found' });

        
      }
      res.status(200).json(updatedCourse);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  

  exports.deleteCourseById = async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      await Course.findByIdAndDelete(courseId);
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

