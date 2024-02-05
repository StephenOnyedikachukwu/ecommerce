const cloudinary = require('cloudinary')
        
cloudinary.config({ 
  cloud_name: 'dfi4v2ccg', 
  api_key: '**************', 
  api_secret: '********************' 
});

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise ((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve({
                url: result.secure_url
            }, {
                resource_type: "auto"
            })
        })
    })
}

module.exports = cloudinaryUploadImg
