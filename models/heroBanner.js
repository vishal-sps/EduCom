const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
  bannerImg: {
    publicId: {
      type: String,
      required: true
    },
    img_url: {
      type: String,
      required: true
    }
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    url: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
});

const HeroBanner = mongoose.model('HeroBanner', heroBannerSchema);

module.exports = HeroBanner;