const router = require('express').Router()

const { createProduct, getProduct, getProducts, updateProduct,
     deleteProduct, rating,
     uploadImages} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImgs');

router.post('/', authMiddleware, isAdmin, createProduct)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10),
 productImgResize, uploadImages)
router.get('/:id', getProduct)
router.put('/rating', authMiddleware, rating)
router.put('/:id', authMiddleware, isAdmin, updateProduct)
router.get('/', getProducts)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)




module.exports = router