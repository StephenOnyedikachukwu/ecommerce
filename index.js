const express = require('express')
const dbConnect = require('./config/dbconnect')
const authRouter = require('./routes/authRoute.js')
const productRouter = require('./routes/productRoute.js')
const blogRouter = require('./routes/blogRoute.js')
const categoryRouter = require('./routes/categoryRoute.js')
const bodyParser = require('body-parser')
const { notFound, errorHandler } = require('./middlewares/errorHandler.js')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000

dbConnect()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRouter)




app.use(notFound)
app.use(errorHandler) 

app.listen(PORT, ()=> {console.log(`server is running on PORT ${PORT}`)})