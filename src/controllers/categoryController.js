import Category from '../models/Category.js';

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    const newCategory = new Category({
      name,
      description,
      image
    });

    const category = await newCategory.save();
    res.status(201).json({
      data: category,
      message: "Category created successfully"
    });
  } catch (error) {
    res.status(400).json({
      data: null,
      message: "Failed to create category",
      error: error.message
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('trips'); // Populating trips to show associated trips

    res.status(200).json({
      data: categories,
      message: "Categories retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Failed to retrieve categories",
      error: error.message
    });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('trips');

    if (!category) {
      return res.status(404).json({
        data: null,
        message: "Category not found"
      });
    }

    res.status(200).json({
      data: category,
      message: "Category retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Failed to retrieve category",
      error: error.message
    });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, image, isActive },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        data: null,
        message: "Category not found"
      });
    }

    res.status(200).json({
      data: updatedCategory,
      message: "Category updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      data: null,
      message: "Failed to update category",
      error: error.message
    });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({
        data: null,
        message: "Category not found"
      });
    }

    res.status(200).json({
      data: deletedCategory,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Failed to delete category",
      error: error.message
    });
  }
};