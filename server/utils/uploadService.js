const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
}



const handleImageUpload = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve('https://placehold.co/600x400/png');
    }

    if (process.env.CLOUDINARY_URL) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'nexonmart' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Cloudinary upload failed: ' + error.message));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      stream.end(file.buffer);
    } else {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `product-${Date.now()}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          console.error('Local file write error:', err);
          reject(new Error('Local storage write failed: ' + err.message));
        } else {
          resolve(`/uploads/${filename}`);
        }
      });
    }
  });
};

module.exports = { handleImageUpload };
