const asyncHandler = require('express-async-handler')
const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const validateMongoDbId = require('../utils/validateMongodbId')
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs')

const createBlog = asyncHandler (async(req,res) => {
    try {
        const newBlog = await Blog.create(req.body)
        res.json ({newBlog})
    } catch (error) {
        throw new Error (error)
    }
})

const updateBlog = asyncHandler (async(req,res) => {
    const {id} = req.params
    // validateMongoDbId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new:true,})
        res.json ({updateBlog})
    } catch (error) {
        throw new Error (error)
    }
})

const getBlog = asyncHandler (async(req,res) => {
    const {id} = req.params
    // validateMongoDbId(id)
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes')
        const updateViews = await Blog.findByIdAndUpdate(id,
        {
        $inc: {numViews:1},
        }, {new: true}
        )
        res.json ({getBlog, updateViews})
    } catch (error) {
        throw new Error (error)
    }
})

const getAllBlog = asyncHandler (async(req,res) => {
    try {
        const getBlogs = await Blog.find()
        res.json ({getBlogs})
    } catch (error) {
        throw new Error (error)
    }
})

const deleteBlog = asyncHandler (async(req,res) => {
    const {id} = req.params
    // validateMongoDbId(id)
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json ({deleteBlog})
    } catch (error) {
        throw new Error (error)
    }
})

const likeBlog = asyncHandler (async(req,res) => {
    const {blogId} = req.body
    // validateMongoDbId(blogId)

    //find blog to like
    const blog = await Blog.findById(blogId)
    //find login user
    const loginUserId = req?.user?._id
    //find if user liked the blog
    const Liked = blog.isLiked
    //find if user disliked the blog
    const Disliked = blog?.dislikes?.find(userId => userId.toStrings() === loginUserId?.toStrings())
    if (Disliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes:loginUserId},
            isDisliked: false
        }, {new: true})
        res.json(blog)
    }
    if (Liked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes:loginUserId},
            isLiked: false
        }, {new: true})
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {likes:loginUserId},
            isLiked: true
        }, {new: true})
        res.json(blog)
    }
})

const dislikeBlog = asyncHandler (async(req,res) => {
    const {blogId} = req.body
    // validateMongoDbId(blogId)

    //find blog to like
    const blog = await Blog.findById(blogId)
    //find login user
    const loginUserId = req?.user?._id
    //find if user liked the blog
    const Disliked = blog.isDisliked
    //find if user disliked the blog
    const Liked = blog?.likes?.find(userId => userId.toStrings() === loginUserId?.toStrings())
    if (Liked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes:loginUserId},
            likesiked: false
        }, {new: true})
        res.json(blog)
    }
    if (Disliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes:loginUserId},
            isDisliked: false
        }, {new: true})
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {dislikes:loginUserId},
            isDisliked: true
        }, {new: true})
        res.json(blog)
    }
})

const uploadImages = asyncHandler (async (req, res) => {
    const {id} = req.params
    try {
        const uploader = (path) => cloudinaryUploadImg(path, 'images')
        const urls = []
        const files = req.files
        for (const file of files ) {
            const {path} = file
            const newPath = await uploader(path)
            urls.push(newPath)
            // fs.unlinkSync(path)
        }
        const findBlog = await Blog.findByIdAndUpdate(id, 
            {images: urls.map(file => {return file})}, {new: true})
        res.json (findBlog)
    } catch (error) {
        throw new Error (error)
    }
})

module.exports = {createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog, uploadImages}