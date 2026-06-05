import User from '../models/User.js';
import Product from '../models/Product.js';
import ProductLike from '../models/ProductLike.js';
import { logActivity } from './activityController.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('wishlist')
      .populate('orders')
      .populate('appointments');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, phone, address, city, pincode } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, city, pincode },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const numericProductId = Number(productId);
    const product = Number.isNaN(numericProductId)
      ? null
      : await Product.findOne({ id: numericProductId });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Store product ObjectId in wishlist so populate() works for user/admin views
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: product._id } },
      { new: true }
    ).populate('wishlist');

    const existingLike = await ProductLike.findOne({ userId, productId: numericProductId });
    if (!existingLike) {
      await ProductLike.create({
        userId,
        productId: numericProductId,
        productRef: product._id
      });

      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { likesCount: 1 } }
      );
    }

    await logActivity(req.userId, 'Wishlist Added', `Added product ${product.name} to wishlist`, 'Wishlist', product._id, req);

    res.json({ 
      success: true, 
      message: 'Added to wishlist', 
      wishlist: user.wishlist,
      likesCount: (await Product.findById(product._id)).likesCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add to wishlist', error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const numericProductId = Number(productId);
    const product = Number.isNaN(numericProductId)
      ? null
      : await Product.findOne({ id: numericProductId });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: product._id } },
      { new: true }
    ).populate('wishlist');

    const deletedLike = await ProductLike.findOneAndDelete({ userId, productId: numericProductId });
    
    if (deletedLike) {
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { likesCount: -1 } }
      );
    }

    await logActivity(req.userId, 'Wishlist Removed', `Removed product ${product?.name || productId} from wishlist`, 'Wishlist', product?._id || undefined, req);
    const updatedProduct = await Product.findOne({ id: numericProductId });
    res.json({ 
      success: true, 
      message: 'Removed from wishlist', 
      wishlist: user.wishlist,
      likesCount: updatedProduct?.likesCount || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove from wishlist', error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
};

// ADMIN: Get all wishlists with user information and product details
export const getAllWishlists = async (req, res) => {
  try {
    const wishlists = await User.find({ wishlist: { $exists: true, $ne: [] } })
      .select('_id name email phone wishlist createdAt')
      .populate({
        path: 'wishlist',
        select: 'id name category price image likesCount'
      })
      .sort({ createdAt: -1 });

    // Enhance with like counts
    const enhancedWishlists = await Promise.all(
      wishlists.map(async (user) => {
        const likeCount = await ProductLike.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          joinedDate: user.createdAt,
          totalLikes: likeCount,
          wishlistCount: user.wishlist.length
        };
      })
    );

    res.json({ 
      success: true, 
      totalUsers: enhancedWishlists.length,
      wishlists: enhancedWishlists 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch wishlists', error: error.message });
  }
};

// ADMIN: Get specific user's wishlist with detailed information
export const getUserWishlistDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('_id name email phone wishlist createdAt')
      .populate({
        path: 'wishlist',
        select: 'id name category price image likesCount'
      });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get like count for this user
    const userLikeCount = await ProductLike.countDocuments({ userId });

    // Get all products with their likes
    const productsWithLikes = await Promise.all(
      user.wishlist.map(async (product) => ({
        ...product.toObject(),
        userHasLiked: true
      }))
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        joinedDate: user.createdAt,
        totalLikes: userLikeCount,
        wishlistCount: user.wishlist.length
      },
      wishlist: productsWithLikes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user wishlist details', error: error.message });
  }
};

// PUBLIC: Get product likes count (displayed on product cards)
export const getProductLikesCount = async (req, res) => {
  try {
    const products = await Product.find().select('id name likesCount category price').sort({ likesCount: -1 });

    res.json({
      success: true,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        likes: p.likesCount
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch likes', error: error.message });
  }
};

// ADMIN: Update product likes count (manual adjustment)
export const updateProductLikes = async (req, res) => {
  try {
    const { productId, likesCount } = req.body;

    if (likesCount < 0) {
      return res.status(400).json({ success: false, message: 'Likes count cannot be negative' });
    }

    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const oldCount = product.likesCount;
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      { likesCount },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Likes count updated',
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        previousCount: oldCount,
        newCount: updatedProduct.likesCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update likes', error: error.message });
  }
};

// ADMIN: Get all product likes (for analytics/management)
export const getAllProductLikes = async (req, res) => {
  try {
    const likes = await ProductLike.find()
      .populate('userId', 'name email')
      .sort({ likedAt: -1 });

    // Summary by product
    const productLikesSummary = {};
    likes.forEach(like => {
      if (!productLikesSummary[like.productId]) {
        productLikesSummary[like.productId] = [];
      }
      productLikesSummary[like.productId].push({
        userId: like.userId,
        likedAt: like.likedAt
      });
    });

    res.json({
      success: true,
      totalLikes: likes.length,
      likesByProduct: productLikesSummary,
      detailedLikes: likes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch likes data', error: error.message });
  }
};

// ADMIN: Remove a user's like for a product (manual management)
export const removeLike = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const like = await ProductLike.findOneAndDelete({ userId, productId });
    if (!like) {
      return res.status(404).json({ success: false, message: 'Like not found' });
    }

    // Decrement likes
    await Product.findByIdAndUpdate(
      product._id,
      { $inc: { likesCount: -1 } }
    );

    // Remove from user's wishlist
    await User.findByIdAndUpdate(userId, { $pull: { wishlist: product._id } });

    res.json({ success: true, message: 'Like removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove like', error: error.message });
  }
};

// ADMIN: Delete a specific wishlist item for a user
export const deleteWishlistItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const product = await Product.findOne({ id: Number(productId) });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => !id.equals(product._id));
    await user.save();

    // Remove like record
    await ProductLike.findOneAndDelete({ userId, productId: Number(productId) });

    // Decrement likes count
    await Product.findByIdAndUpdate(product._id, { $inc: { likesCount: -1 } });

    res.json({ success: true, message: 'Wishlist item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete wishlist item', error: error.message });
  }
};

// ADMIN: Delete all wishlist items for a user
export const deleteUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const wishlistCount = user.wishlist.length;

    // Get all products and decrement like count per product
    const products = await Product.find({ _id: { $in: user.wishlist } });
    for (const product of products) {
      await Product.findByIdAndUpdate(product._id, { $inc: { likesCount: -1 } });
    }

    // Delete all likes for this user
    await ProductLike.deleteMany({ userId });

    // Clear wishlist
    user.wishlist = [];
    await user.save();

    res.json({ success: true, message: 'All wishlist items deleted', deletedCount: wishlistCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete wishlist', error: error.message });
  }
};

// ADMIN: Delete multiple users
export const deleteMultipleUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid user IDs' });
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });

    res.json({ success: true, message: 'Users deleted', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete users', error: error.message });
  }
};

// Get current user profile
export const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('orders')
      .populate('appointments');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      name,
      phone,
      address,
      city,
      state,
      country,
      pincode,
      preferences,
    } = req.body;

    const updateData = {
      name,
      phone,
      address,
      city,
      state,
      country,
      pincode,
    };

    if (preferences) {
      updateData.preferences = preferences;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logActivity(userId, 'Profile Updated', 'User updated their profile information', 'Profile', null, req);

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

// Update user preferences
export const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.userId;
    const preferences = req.body.preferences;

    const user = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logActivity(userId, 'Preferences Updated', 'User updated notification preferences', 'Settings', null, req);

    res.json({ success: true, message: 'Preferences updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update preferences', error: error.message });
  }
};

// Verify user email/phone (KYC)
export const verifyUserKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, document } = req.body;

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid KYC status' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        kycStatus: status,
        ...(document && { kycDocument: document }),
        ...(status === 'verified' && { isVerified: true })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logActivity(req.userId, 'KYC Status Updated', `User KYC status set to ${status}`, 'Verification', null, req);

    res.json({ success: true, message: `KYC ${status}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update KYC status', error: error.message });
  }
};
