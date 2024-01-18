const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  category_name: String,
  img_src:String,
  image_public_id: String
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
