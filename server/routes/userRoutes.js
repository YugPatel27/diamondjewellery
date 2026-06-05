import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getCurrentUserProfile,
  updateUserProfile,
  updateUserPreferences,
  verifyUserKYC,
  getAllWishlists,
  getUserWishlistDetails,
  getAllProductLikes,
  updateProductLikes,
  removeLike,
  deleteWishlistItem,
  deleteUserWishlist,
  deleteMultipleUsers
} from '../controllers/userController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Wishlist routes (authenticated users)
router.get('/wishlist', getWishlist);
router.post('/wishlist/add', addToWishlist);
router.post('/wishlist/remove', removeFromWishlist);

// User Profile & Settings Routes (authenticated)
router.get('/profile/current', getCurrentUserProfile);
router.put('/profile/update', updateUserProfile);
router.put('/profile/preferences', updateUserPreferences);

// Admin wishlist/likes routes
router.get('/admin/wishlists/all', adminOnly, getAllWishlists);
router.get('/admin/wishlist/:userId', adminOnly, getUserWishlistDetails);
router.get('/admin/likes/all', adminOnly, getAllProductLikes);
router.put('/admin/likes/update', adminOnly, updateProductLikes);
router.post('/admin/likes/remove', adminOnly, removeLike);
router.delete('/admin/wishlist/:userId/:productId', adminOnly, deleteWishlistItem);
router.delete('/admin/wishlist/:userId', adminOnly, deleteUserWishlist);
router.post('/admin/delete-multiple', adminOnly, deleteMultipleUsers);
router.put('/admin/kyc/:userId', adminOnly, verifyUserKYC);

// Standard user routes
router.get('/', adminOnly, getUsers);
router.get('/:id', adminOnly, getUserById);
router.put('/:id', adminOnly, updateUser);
router.delete('/:id', adminOnly, deleteUser);

export default router;
