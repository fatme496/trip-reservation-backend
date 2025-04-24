import Image from '../models/Image.js';

export const addImage = async (req, res) => {
  try {
    const { url, caption, tripId } = req.body;
    const image = new Image({ url, caption, tripId });
    await image.save();
    res.status(201).json({
      data: image,
      message: "Image added successfully"
    });
  } catch (error) {
    res.status(400).json({
      data: null,
      message: "Failed to add image",
      error: error.message
    });
  }
};

export const getTripImages = async (req, res) => {
  try {
    const { tripId } = req.params;
    const images = await Image.find({ tripId });
    res.status(200).json({
      data: images,
      message: "Images retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Failed to retrieve images",
      error: error.message
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Image.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        data: null,
        message: "Image not found"
      });
    }
    res.status(200).json({
      data: deleted,
      message: "Image deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      data: null,
      message: "Failed to delete image",
      error: error.message
    });
  }
};