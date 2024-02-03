const asyncHandler = require('express-async-handler')
const coupon = require('../models/couponModel')

const createCoupon = asyncHandler (async (req, res) => {
    try {
        const newCoupon = await coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error (error)
    }
})

const getAllCoupon = asyncHandler (async (req, res) => {
    try {
        const coupons = await coupon.find(req.body)
        res.json(coupons)
    } catch (error) {
        throw new Error (error)
    }
})

const updateCoupon = asyncHandler (async (req, res) => {
    const {id} = req.params
    try {
        const updateCoupon = await coupon.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updateCoupon)
    } catch (error) {
        throw new Error (error)
    }
})

const deleteCoupon = asyncHandler (async (req, res) => {
    const {id} = req.params
    try {
        const deleteCoupon = await coupon.findByIdAndDelete(id)
        res.json(deleteCoupon)
    } catch (error) {
        throw new Error (error)
    }
})


module.exports = {createCoupon, getAllCoupon, updateCoupon, deleteCoupon}