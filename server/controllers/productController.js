const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Requires Admin Token)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, price, description, brand, category, countInStock } = req.body;
    
    // Safely capture uploaded image path, fallback to placeholder if text-only test
    const imagePath = req.file ? `/uploads/${req.file.filename}` : 'https://placehold.co/600x400/png';

    const product = new Product({
      user: req.user._id,
      name: name || 'Sample Tech Gadget',
      price: price || 299,
      image: imagePath,
      brand: brand || 'NexusBrand',
      category: category || 'Electronics',
      countInStock: countInStock || 10,
      description: description || 'High performance modern consumer electronics product.',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct };