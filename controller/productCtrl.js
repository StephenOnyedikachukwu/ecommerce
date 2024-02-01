const slugify = require('slugify')
const Product = require('../models/productModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')
const { json } = require('body-parser')

const createProduct = asyncHandler (async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error (error)
    }
})

const updateProduct = asyncHandler (async (req, res) => {
    const id = req.params.id
    // validateMongoDbId(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await product.findOneAndUpdate({_id:id}, req.body, {
            new:true,
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error (error)
    }
})

const deleteProduct = asyncHandler (async (req, res) => {
    const id = req.params.id
    // validateMongoDbId(id)
    try {
        const deleteProduct = await product.findOneAndDelete({_id:id})
        res.json(deleteProduct)
    } catch (error) {
        throw new Error (error)
    }
})

const getProduct = asyncHandler (async (req, res) => {
    const {id} = req.params
    try {
        const findProduct = await product.findById(id)
        res.json(findProduct)
    } catch (error) {
        throw new Error (error)
    }
})

const getProducts = asyncHandler (async (req, res) => {
    // const {id} = req.params
    try {
        //filtering
        const queryObj = {...req.query} 
        const excludeFields = ['page', 'sort', 'limits', 'fields'] 
        excludeFields.forEach(el=> delete queryObj[el])
        console.log(queryObj);

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

        let query = product.find(JSON.parse(queryStr));

        //sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createdAt")
        }

        //limiting fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)

        } else {
            query = query.select('-__v')
        }

        //pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if(req.query.page) {
            const productCount = await product.countDocuments()
            if(skip>= productCount) throw new Error ('This page does not exist')
        }
        console.log(page, limit, skip);

        const products = await query
        res.json(products);
        // const findProducts = await product.find(req.query)
        // res.json(findProducts)
    } catch (error) {
        throw new Error (error)
    }
})

const addToWishlist = asyncHandler (async (req, res) => {
    const {_id} = req.user
    const {productId} = req.body
    try {
        const user = await User.findById(_id)
        const added = user.wishlist.includes(productId)
        if (added) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull:{wishlist:productId}
            }, {new:true} )
            res.json(user)
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push:{wishlist:productId}
            }, {new:true} )
            res.json(user)
        }
    } catch (error) {
        throw new Error (error)
    }
})

const rating = asyncHandler (async (req, res) => {
    const {_id} = req.user
    const {star, productId, comment} = req.body
   try {
    const product = await Product.findById(productId)

    let rated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString())
    if (rated) {
        const updateRating = await Product.updateOne(
            {
                ratings: {$elemMatch: rated},
            },
            {
                $set: {"ratings.$.star": star, "ratings.$.comment": comment}
            }, {new: true}
        )
    }else {
        const rateProduct = await Product.findByIdAndUpdate(productId, {
            $push: {ratings:{
                star:star, 
                comment:comment, 
                postedby:_id,
            }
            }, 
               
        }, {new: true})
    }
    const getAllRatings = await Product.findById(productId)
    let totalRatings = getAllRatings.ratings.length
    let sum = getAllRatings.ratings.map((item)=>item.star).reduce((prev, curr) => prev + curr, 0)
    let actualRating = Math.round(sum/totalRatings)
    let finalProduct = await Product.findByIdAndUpdate(productId,{
        totalRating: actualRating
    }, {mew: true})
    res.json(finalProduct)
   } catch (error) {
    throw new Error (error)
   }
})
module.exports = {createProduct, getProduct, getProducts, updateProduct, deleteProduct, 
    addToWishlist, rating }