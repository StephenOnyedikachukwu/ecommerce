const router = require('express').Router()

const { createProduct, getProduct, getProducts, updateProduct,
     deleteProduct, 
     addToWishlist} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, isAdmin, createProduct)
router.get('/:id', getProduct)
router.put('/wishlist', authMiddleware, addToWishlist)
router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.get('/', getProducts)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)




module.exports = router