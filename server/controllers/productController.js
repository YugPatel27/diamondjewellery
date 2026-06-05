import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, style, metal, shape, minPrice, maxPrice, search, sort, cut, clarity, color, minCarat, maxCarat, diamondType } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (style) filter.style = style;
    if (metal) filter.metal = metal;
    if (shape) filter.shape = shape;
    if (cut) filter.cut = cut;
    if (clarity) filter.clarity = clarity;
    if (color) filter.color = color;
    if (diamondType) filter.diamondType = diamondType;
    if (search) filter.$text = { $search: search };
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minCarat || maxCarat) {
      filter.carat = {};
      if (minCarat) filter.carat.$gte = Number(minCarat);
      if (maxCarat) filter.carat.$lte = Number(maxCarat);
    }

    let query = Product.find(filter);
    
    if (sort === 'price-asc') query = query.sort({ price: 1 });
    else if (sort === 'price-desc') query = query.sort({ price: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });
    else if (sort === 'relevant') query = query.sort({ likesCount: -1, createdAt: -1 });

    const products = await query.limit(100);
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    let product = null;
    if (!Number.isNaN(numericId)) {
      product = await Product.findOne({ id: numericId });
    }

    if (!product) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? (lastProduct.id || 0) + 1 : 1;
    
    const productData = {
      ...req.body,
      id: req.body.id || nextId,
      image: req.body.image || '/placeholder.jpg',
      images: req.body.images && req.body.images.length > 0 ? req.body.images : ['/placeholder.jpg'],
      price: Number(req.body.price),
      originalPrice: req.body.originalPrice || Math.round(Number(req.body.price) * 1.15),
      carat: Number(req.body.carat) || 0
    };

    const product = new Product(productData);
    await product.save();
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    let product;

    if (!Number.isNaN(numericId)) {
      product = await Product.findOneAndUpdate({ id: numericId }, req.body, { new: true, runValidators: true });
    }

    if (!product) {
      product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    let product;

    if (!Number.isNaN(numericId)) {
      product = await Product.findOneAndDelete({ id: numericId });
    }

    if (!product) {
      product = await Product.findByIdAndDelete(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).limit(20);
    
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed' });
  }
};
