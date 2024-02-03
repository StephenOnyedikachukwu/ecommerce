const express = require('express')
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, 
    likeBlog, 
    dislikeBlog,
    uploadImages} = require('../controller/blogCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadImgs')
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/likes', authMiddleware, likeBlog)
router.put('/dislikes', authMiddleware, dislikeBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10),
 blogImgResize, uploadImages)
router.get('/:id', getBlog)
router.get('/', getAllBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)


module.exports = router