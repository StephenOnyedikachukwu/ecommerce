const asyncHandler = require('express-async-handler')
const brand = require('../models/brandModel')
const { validateMongoDbId } = require('../utils/validateMongodbId')

const createBrand = asyncHandler (async(req,res) => {
    try {
        const newBrand = await brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error (error)
    }
})

const updateBrand = asyncHandler (async(req,res) => {
    const {id} = req.params
    try {
        const updateBrand = await brand.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updateBrand)
    } catch (error) {
        throw new Error (error)
    }
})

const deleteBrand = asyncHandler (async(req,res) => {
    const {id} = req.params
    try {
        const deleteBrand = await brand.findByIdAndDelete(id, req.body, {new:true})
        res.json(deleteBrand)
    } catch (error) {
        throw new Error (error)
    }
})

const getBrand = asyncHandler (async(req,res) => {
    const {id} = req.params
    try {
        const getBrand = await brand.findById(id)
        res.json(getBrand)
    } catch (error) {
        throw new Error (error)
    }
})

const getAllBrand = asyncHandler (async(req,res) => {
    const {id} = req.params
    try {
        const getBrands = await brand.find()
        res.json(getBrands)
    } catch (error) {
        throw new Error (error)
    }
})

module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand }