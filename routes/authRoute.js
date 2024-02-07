const { createUser, loginUserCtrl, getAllUsers, getUser, deleteUser, updateUser, 
    blockUSer, unblockUSer, handleRefreshToken, logout, updatePassword, 
    forgotPasswordToken, 
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus} = require('../controller/userCtr');

const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.use(express.json());
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.post('/forgot-passowrd-token', forgotPasswordToken);
router.post('/cart/apply-coupon', authMiddleware, applyCoupon);
router.post('/cart/create-order', authMiddleware, createOrder);
router.put('/reset-password/:token', resetPassword);
router.put('/password', authMiddleware, updatePassword);
router.get('/all-users', getAllUsers);
router.get('/get-orders', authMiddleware, getOrders);
router.get('/refresh', handleRefreshToken);
router.get('/:id', authMiddleware, isAdmin, getUser);
router.get('/logout', logout);
router.get('/wishlist/:id', authMiddleware, getWishlist)
router.get('/cart/:id', authMiddleware, getUserCart)
router.delete('/empty-cart', authMiddleware, emptyCart);
router.delete('/:id', deleteUser);
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUSer);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUSer);




module.exports = router;