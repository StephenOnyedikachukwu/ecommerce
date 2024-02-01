const { createCoupon } = require("../controller/couponCtrl");
const router = require('express').Router()

router.post('/', createCoupon)

module.exports = router