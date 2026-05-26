const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'image/avif';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only (jpg, jpeg, png, webp, avif)!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;