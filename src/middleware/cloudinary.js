const cloudinary = require("cloudinary").v2;
// const {
//   CLOUD_NAME,
//   CLOUD_API_KEY,
//   CLOUD_API_SECRET,
// } = require("../core/config");

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = {
  uploadToCloudinary(file, servicename, foldername) {
    return cloudinary.uploader
      .upload(file.path, {
        resource_type: "raw",
        public_id: `facultyselection/${servicename}/${foldername}/${file.originalname}`,
      })
      .then((result) => {
        return {
          url: result.secure_url,
        };
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  },
};
