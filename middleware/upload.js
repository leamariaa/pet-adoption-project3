const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|webp/;
    const ext = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = fileTypes.test(file.mimetype);

    if (ext && mime) {
      cb(null, true);
    } else {
      cb("Images only");
    }
  }
});

module.exports = upload;