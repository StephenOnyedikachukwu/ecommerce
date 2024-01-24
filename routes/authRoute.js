const { createUser, loginUserCtrl, getAllUsers, getUser, deleteUser, updateUser, 
    blockUSer, unblockUSer, handleRefreshToken, logout, updatePassword, 
    forgotPasswordToken, 
    resetPassword} = require('../controller/userCtr')

const express = require('express')
const router = express.Router()
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.use(express.json())
router.post('/register', createUser)
router.post('/login', loginUserCtrl)
router.post('/forgot-passowrd-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/password', authMiddleware, updatePassword)
router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.get('/logout', logout)
router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateUser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUSer)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUSer)


module.exports = router