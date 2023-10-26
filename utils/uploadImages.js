const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = 'public/Images';

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Set up the storage engine and destination for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Specify the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Use a unique filename for the stored file
  },
});

// Create the multer instance and specify the storage options
const upload = multer({ storage: storage });

module.exports = upload;