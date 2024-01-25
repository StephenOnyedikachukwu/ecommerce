const asyncHandler = require('express-async-handler')
const category = require('../models/blogCategoryModel')
const { validateMongoDbId } = require('../utils/validateMongodbId')

const createCategory = asyncHandler (async(req,res) => {
    try {
        const newCategory = await category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error (error)
    }
})

const updateCategory = asyncHandler (async(req,res) => {
    const {id} = req.params
    try {
        const updateCategory = await category.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updateCategory)
    } catch (error) {
        throw new Error (error)
    }
})

const deleteCategory = asyncHandler (async(req,res) => {
    const {id} = req.params
    try {
        const deleteCategory = await category.findByIdAndDelete(id, req.body, {new:true})
        res.json(deleteCategory)
    } catch (error) {
        throw new Error (error)
    }
})

const getCategory = asyncHandler (async(req,res) => {
    const {id} = req.params
    try {
        const getCategory = await category.findById(id)
        res.json(getCategory)
    } catch (error) {
        throw new Error (error)
    }
})

const getAllCategory = asyncHandler (async(req,res) => {
    const {id} = req.params
    try {
        const getCategories = await category.find()
        res.json(getCategories)
    } catch (error) {
        throw new Error (error)
    }
})

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory }