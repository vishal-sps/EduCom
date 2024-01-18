const express = require('express');
const uploadImage = require('../utils/uploadImage'); // Import your uploadImage function
const TrustedCompany = require('../models/TrustedCompany');

// Create a new TrustedCompany
exports.createTrustedCompany = async (req, res) => {
  try {
    const { company_title } = req.body;
    

    // Check if required fields are present
    if (!req.files?.logo_img || !company_title) {
      return res.status(400).json({ message: 'Missing required fields in the request.' });
    }

    // Upload image and get img_url
    const { img_url, public_id } = await uploadImage(req.files?.logo_img, "trustedCompany");

    // Create a new TrustedCompany instance
    const newCompany = new TrustedCompany({
      logo_img: {publicId: public_id,img_url},
      company_title
    });

    // Save the new TrustedCompany to the database
    const savedCompany = await newCompany.save();

    res.status(201).json(savedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Get all TrustedCompanies
exports.getAllTrustedCompanies = async (req, res) => {
  try {
    const companies = await TrustedCompany.find();
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Get a specific TrustedCompany by ID
exports.getTrustedCompanyById = async (req, res) => {
  try {
    const company = await TrustedCompany.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'TrustedCompany not found.' });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Update a TrustedCompany by ID
exports.updateTrustedCompanyById = async (req, res) => {
  try {
    const {  company_title, public_id } = req.body;
    

    // Upload image and get img_url
    if (req.files?.logo_img) {
      const { img_url } = await uploadImage(req.files?.logo_img, "trustedCompany");
      
    }

    // Find the TrustedCompany by ID and update its fields
    const updatedCompany = await TrustedCompany.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: 'TrustedCompany not found.' });
    }

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Delete a TrustedCompany by ID
exports.deletedTrustedCompanyById =  async (req, res) => {
  try {
    const deletedCompany = await TrustedCompany.findByIdAndDelete(req.params.id);

    if (!deletedCompany) {
      return res.status(404).json({ message: 'TrustedCompany not found.' });
    }

    res.status(200).json({ message: 'TrustedCompany deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};


