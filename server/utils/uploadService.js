const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary using the CLOUDINARY_URL environment variable
if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
}

/**
 * Handle image upload.
 * If CLOUDINARY_URL is set, upload to Cloudinary.
 * Otherwise, save to local disk space.
 * @param {Object} file - The file object from multer (memoryStorage)
 * @returns {Promise<string>} - Resolves to the image URL/path
 */
const handleImageUpload = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve('https://placehold.co/600x400/png');
    }

    if (process.env.CLOUDINARY_URL) {
      // Cloudinary upload
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'nexusmart' },
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
      // Local file system upload
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      
      // Ensure local uploads directory exists
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
