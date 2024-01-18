const mongoose = require('mongoose');

const trustedCompanySchema = new mongoose.Schema({
  logo_img: {
    publicId: {
      type: String,
      required: true
    },
    img_url: {
      type: String,
      required: true
    }
  },
  company_title: {
    type: String,
    required: true
  }
});

const TrustedCompany = mongoose.model('TrustedCompany', trustedCompanySchema);

module.exports = TrustedCompany;