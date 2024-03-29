const mongoose = require('mongoose')

const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if(!isValid) throw new Error ('invalid id or not found')
}

module.exports = validateMongoDbId