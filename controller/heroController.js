const express = require('express');
const HeroBanner = require('../models/heroBanner');
const { uploadImage, updateImage } = require('../helper/uploadImage');

// Create a new HeroBanner
exports.createHeroBanner = async (req, res) => {
  try {
    const {  title, description, link_url, link_text } = req.body;
    const {img_file} = req.files
    // Check if required fields are present
    if (!img_file || !title || !description || !link_url || !link_text) {
      return res.status(400).json({ message: 'Missing required fields in the request.' });
    }

    const { public_id, img_url } = await uploadImage(img_file, "heroBanner");

    const newBanner = new HeroBanner({
      bannerImg: {
        publicId: public_id,
        img_url: img_url
      },
      title,
      description,
      link:{
        url: link_url,
        text: link_text
      }
    });

    const savedBanner = await newBanner.save();

    res.status(201).json(savedBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Get all HeroBanners
exports.getAllHeroBanner =  async (req, res) => {
  try {
    const banners = await HeroBanner.find();
    res.status(200).json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Get a specific HeroBanner by ID
exports.getHeroBannerById =  async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Update a HeroBanner by ID
exports.updateHeroBannerById =  async (req, res) => {
  try {
    const { title, description, link_url, link_text , public_id} = req.body;
    // Upload image and get publicId and img_url
    if(req.files?.img_file){
        await updateImage(req.files?.img_file, public_id)
    }

    const updateObj = {
        title,
        description
      };
  
      // Update link_url if it exists in the request body
      if (link_url) {
        updateObj['link.url'] = link_url;
      }
  
      // Update link_text if it exists in the request body
      if (link_text) {
        updateObj['link.text'] = link_text;
      }
  
    // Find the HeroBanner by ID and update its fields
    const updatedBanner = await HeroBanner.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }

    res.status(200).json(updatedBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Delete a HeroBanner by ID
exports.deleteHeroBannerById = async (req, res) => {
  try {
    const deletedBanner = await HeroBanner.findByIdAndDelete(req.params.id);

    if (!deletedBanner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }

    res.status(200).json({ message: 'Banner deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};