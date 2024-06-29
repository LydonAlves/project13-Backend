const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

const uploadsDir = path.join(os.tmpdir(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  console.log(`Creating uploads directory at ${uploadsDir}`);
  fs.mkdirSync(uploadsDir);
} else {
  console.log(`Uploads directory already exists at ${uploadsDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Saving file to directory: ${uploadsDir}`);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    console.log(`Saving file with original name: ${file.originalname}`);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;
