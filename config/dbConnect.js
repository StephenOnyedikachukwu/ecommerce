const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MongoDB_URL)
        console.log('Database Connected Successfully');
    } catch (err){
        console.log('Database error');;
    }
}

module.exports = dbConnect