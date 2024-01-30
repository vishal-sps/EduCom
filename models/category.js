const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  category_name: String,
  img_src:String,
  image_public_id: String,
  position: {
    type: Number,
    unique: true,
  },
});

categorySchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.position) {
    const lastCategory = await doc.constructor.findOne({}, {}, { sort: { position: -1 } });
    doc.position = lastCategory ? lastCategory.position + 1 : 1;
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
