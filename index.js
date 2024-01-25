const express = require('express')
const dbConnect = require('./config/dbconnect')
const authRouter = require('./routes/authRoute.js')
const productRouter = require('./routes/productRoute.js')
const blogRouter = require('./routes/blogRoute.js')
const productCategoryRouter = require('./routes/productCategoryRoute.js')
const brandRouter = require('./routes/brandRoute.js')
const blogCategoryRouter = require('./routes/blogCategoryRoute.js')
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
app.use('/api/productCategory', productCategoryRouter)
app.use('/api/blogCategory', blogCategoryRouter)
app.use('/api/brand', brandRouter)


app.use(notFound)
app.use(errorHandler) 

app.listen(PORT, ()=> {console.log(`server is running on PORT ${PORT}`)})