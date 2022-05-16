const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`);
  },
});

var upload = multer({
  storage: storage,
});

module.exports = upload;
