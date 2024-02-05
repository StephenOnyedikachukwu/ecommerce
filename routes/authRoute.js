const { createUser, loginUserCtrl, getAllUsers, getUser, deleteUser, updateUser, 
    blockUSer, unblockUSer, handleRefreshToken, logout, updatePassword, 
    forgotPasswordToken, 
    resetPassword,
    loginAdmin,
    addToWishlist,
    getWishlist} = require('../controller/userCtr');

const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.use(express.json());
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdmin);
router.post('/forgot-passowrd-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.put('/password', authMiddleware, updatePassword);
router.get('/all-users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.get('/:id', authMiddleware, isAdmin, getUser);
router.get('/logout', logout);
router.put('/get-wishlist', authMiddleware, getWishlist);
router.put('/wishlist', authMiddleware, addToWishlist);
router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUSer);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUSer);




module.exports = router;