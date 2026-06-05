import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [], totalPrice: 0, totalItems: 0 });
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Get cart error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, customization } = req.body;
    const customizationPrice = Number(customization?.customizationPrice || customization?.selectedDiamond?.price || 0);

    // Validate inputs
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }

    // Try to find product by numeric id or MongoDB ObjectId
    let product;
    if (!isNaN(productId)) {
      product = await Product.findOne({ id: parseInt(productId) });
    } else {
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check stock availability
    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({
        userId: req.userId,
        items: [],
        totalPrice: 0,
        totalItems: 0
      });
    }

    const normalizeCustomization = (cust) => {
      if (!cust) return "";
      const { customizationPrice, ...rest } = cust;
      return JSON.stringify(rest);
    };

    const customizationKey = normalizeCustomization(customization);
    const existingItemIndex = cart.items.findIndex(
      item => {
        const itemCustomizationKey = normalizeCustomization(item.customization);
        return item.productId.toString() === product._id.toString() && itemCustomizationKey === customizationKey;
      }
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId: product._id,
        quantity,
        price: product.price,
        customization,
        customizationPrice
      });
    }

    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => {
      const itemPrice = (item.price || 0) + (item.customizationPrice || 0);
      return sum + (itemPrice * item.quantity);
    }, 0);

    // Save cart
    await cart.save();

    // Populate product details for response
    await cart.populate('items.productId');

    res.status(201).json({
      success: true,
      message: 'Added to cart',
      cart,
      itemCount: cart.totalItems
    });

  } catch (error) {
    console.error('Add to cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add to cart'
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, customization } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    let product;
    if (!isNaN(productId)) {
      product = await Product.findOne({ id: parseInt(productId) });
    } else {
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const normalizeCustomization = (cust) => {
      if (!cust) return "";
      const { customizationPrice, ...rest } = cust;
      return JSON.stringify(rest);
    };

    const customizationKey = normalizeCustomization(customization);

    // Filter out the specific product variant
    cart.items = cart.items.filter(item => {
      const itemCustomizationKey = normalizeCustomization(item.customization);
      return !(item.productId.toString() === product._id.toString() && itemCustomizationKey === customizationKey);
    });

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => {
      const itemPrice = (item.price || 0) + (item.customizationPrice || 0);
      return sum + (itemPrice * item.quantity);
    }, 0);

    await cart.save();
    res.json({ success: true, message: 'Removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to remove from cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, customization } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ success: false, message: 'Quantity cannot be negative' });
    }

    let product;
    if (!isNaN(productId)) {
      product = await Product.findOne({ id: parseInt(productId) });
    } else {
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const normalizeCustomization = (cust) => {
      if (!cust) return "";
      const { customizationPrice, ...rest } = cust;
      return JSON.stringify(rest);
    };

    const customizationKey = normalizeCustomization(customization);

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items = cart.items.filter(item => {
        const itemCustomizationKey = normalizeCustomization(item.customization);
        return !(item.productId.toString() === product._id.toString() && itemCustomizationKey === customizationKey);
      });
    } else {
      // Update quantity
      const item = cart.items.find(i => {
        const itemCustomizationKey = normalizeCustomization(i.customization);
        return i.productId.toString() === product._id.toString() && itemCustomizationKey === customizationKey;
      });
      if (item) {
        item.quantity = quantity;
      }
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => {
      const itemPrice = (item.price || 0) + (item.customizationPrice || 0);
      return sum + (itemPrice * item.quantity);
    }, 0);

    await cart.save();
    res.json({ success: true, message: 'Cart updated', cart });
  } catch (error) {
    console.error('Update cart error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
};

export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();
    res.json({ success: true, message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Clear cart error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};
