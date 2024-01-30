const {uploadImage, updateImage, deleteImage, deleteAllImage}  = require('../helper/upload');
const Category = require('../models/category'); // Import your Category model

exports.createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const {img_file} = req.files;
    const {img_url, public_id} = await uploadImage(img_file, "category")
    const newCategory = new Category({ category_name, img_src:img_url, image_public_id:public_id });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
    // res.status(200).json({running:category_name})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategoryById = async (req, res) => {
  try {
    const { category_name } = req.body;
    const {img_file} = req.files;

    const existingCategory = await Category.findById(req.params.id)
    if(existingCategory){
      let existing_public_id = existingCategory.image_public_id
      let {img_url, public_id} = await updateImage(img_file,existing_public_id )
      console.log("updated imgUrl", img_url, "public_url",public_id);
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { category_name, img_src:img_url },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(updatedCategory);
    }
    
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePosition= async(req,res) =>{
      try {
        let {categoryId1, categoryId2 }= req.body
        const category1 = await Category.findById(categoryId1);
        const category2 = await Category.findById(categoryId2);
        
        const tempPosition1 = category1.position;
        const tempPosition2 = category2.position;

      category1.position = -1;
      await category1.save();

      category2.position = tempPosition1;
      await category2.save();

      category1.position = tempPosition2;
      await category1.save();
    
        return res.status(200).json({ category1, category2 });
      } catch (error) {
        // throw error;
        console.log("error", error);
        return res.status(500).json({error: error});
      }
    }



exports.deleteCategoryById = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        // Update positions of remaining categories
      await Category.updateMany({ position: { $gt: deletedCategory?.position } }, { $inc: { position: -1 } });

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await deleteImage(deletedCategory.image_public_id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAllCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.deleteMany();
    if (!deletedCategory) {
  
      return res.status(404).json({ message: 'Category not found' });
    }
   await deleteAllImage('category')
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};