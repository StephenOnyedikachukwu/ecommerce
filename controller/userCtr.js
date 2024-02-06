const { generateToken } = require('../config/jwtToken.js');
const User = require('../models/userModel.js');
const Product = require('../models/productModel.js');
const Cart = require('../models/cartModel.js');
const Order = require('../models/orderModel.js');
const asyncHandler = require('express-async-handler');
const  validateMongoDbId  = require('../utils/validateMongodbId.js');
const { generateRefreshToken } = require('../config/refreshToken.js');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController.js');
const crypto = require('crypto');
const { log } = require('console');

//create user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if(!findUser) {
        //create new user
        const newUser = User.create(req.body);
        res.json(newUser);
    } else {
        //user already exist
        throw new Error ('User Already Exist');
    }
});

//login user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password }  = req.body;
    //check if user exists or not
    const findUser = await User.findOne({email});
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUser = await User.findByIdAndUpdate(findUser._id, {
            refreshToken: refreshToken,
        }, {new: true});
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error ('invalid credentials');
    }
})

//login Admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password }  = req.body;
    //check if user exists or not
    const findAdmin = await User.findOne({email});
    if(findAdmin.role !=='admin') throw new Error ('Not Authorized')
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?.id);
        const updateUser = await User.findByIdAndUpdate(findAdmin._id, {
            refreshToken: refreshToken,
        }, {new: true});
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        });
    } else {
        throw new Error ('invalid credentials');
    }
})

//handle refresh token 
const handleRefreshToken = asyncHandler (async(req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error ('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne ({refreshToken});
    if(!user) throw new Error ('Token not Matched');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id) {
            throw new Error ('There is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken});
    });
})

//logout functionality
const logout = asyncHandler (async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error ('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne ({refreshToken});
    if(!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        })
        return res.sendStatus(204) //forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "", 
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204) //forbidden
});

//update user
const updateUser = asyncHandler(async(req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new: true,
        })
        res.json(updateUser)
    } catch (error) {
        throw new Error (error)
    }
})

const saveAddress = asyncHandler (async (req, res, next) => {
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        }, {
            new: true,
        })
        res.json(updateUser)
    } catch (error) {
        throw new Error (error)
    }
})


//get all users
const getAllUsers = asyncHandler(async(req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error (error)
    }
})

//get single user 
const getUser = asyncHandler (async(req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getUser = await User.findById(id)
        res.json({ getUser})
    } catch (error) {
        throw new Error (error)
    }
})

//delete user 
const deleteUser = asyncHandler (async(req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deleteUser = await User.findByIdAndDelete(id)
        res.json(deleteUser)
    } catch (error) {
        throw new Error (error)
    }
})

const blockUSer = asyncHandler (async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const block = await User.findByIdAndUpdate(id, {isBlocked: true}, {new: true})
        res.json({message: 'User Blocked'})
    } catch (error) {
        throw new Error (error)
    }
})
const unblockUSer = asyncHandler (async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const unblock = await User.findByIdAndUpdate(id, {isBlocked: false}, {new: true})
        res.json({message: 'User Unblocked'})
    } catch (error) {
        throw new Error (error)
    }
})

const updatePassword = asyncHandler (async (req, res) => {
    const {_id} = req.user
    const {password} = req.body
    validateMongoDbId(_id)
    const user = await User.findById(_id)
    if (password) {
        user.password = password
        const updatedPassword = await user.save()
        res.json(updatedPassword)
    } else {
        res.json(user)
    }
})

const forgotPasswordToken = asyncHandler (async(req,res) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user) throw new Error ('this email is not correct')
    try {
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = `follow this link to to reset your password. link only valid for 10 minutes
        <a href='http:localhost:4000/api/user/reset-password/${token}'>click here</>`
        const data = {
            to:email,
            subject: "Forgot Password Link",
            text: 'hey user',
            htm: resetURL,
        }
        sendEmail(data)
        res.json(token)
    } catch (error) {
        throw new Error (error)
    }
})

const resetPassword = asyncHandler (async(req,res) =>{
    const {password} = req.body
    const {token} = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex")
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires:{$gt:Date.now()},
    })
    if(!user) throw new Error ("incorrect credentials")
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.json(user)
})

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
      const findUser = await User.findById(_id).populate("wishlist");
      res.json(findUser);
    } catch (error) {
      throw new Error(error);
    }
  });

  const userCart = asyncHandler (async (req, res) => {
    const {cart} = req.body
    const { _id }  = req.user
    validateMongoDbId(_id)
    try {
        let products = []
        const user = await User.findById(_id)
        //check if product exists in cart
        const productExists = await Cart.findOne({orderby: user._id})
        if(productExists) {
            productExists.remove()
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {}
            object.prduct = cart[i]._id
            object.count = cart[i].count
            object.color = cart[i].color
            let getPrice = await Product.findById(cart[i]._id).select('price').exec()
            object.price = getPrice.price
            products.push(object)
        }
        let cartTotal = 0
        for (i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id
        }). save()
        res.json(newCart)
    } catch (error) {
        throw new Error (error)
    }
  })

module.exports = { createUser, loginUserCtrl, loginAdmin, getAllUsers, getUser, deleteUser, updateUser, 
    saveAddress, userCart,
    blockUSer, unblockUSer, handleRefreshToken, logout, updatePassword, forgotPasswordToken, 
    resetPassword, getWishlist}