import Category from '../models/Category.js';

// Create a category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
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
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      data: categories,
      message: "Categories retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      message: "Categories cannot be displayed",
      error: error.message
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({
        data: null,
        message: "Category not found"
      });
    }
    res.status(200).json({
      data: updated,
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

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        data: null,
        message: "Category not found"
      });
    }
    res.status(200).json({
      data: deleted,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      data: null,
      message: "Failed to delete category",
      error: error.message
    });
  }
};