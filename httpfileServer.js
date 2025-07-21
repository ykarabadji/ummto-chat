// httpfileServer.js
// -----------------
// Express server for handling file uploads and serving uploaded files.
// Used by the chat application to upload and share files (PDF, images, etc).

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Multer storage configuration: store files in 'uploads/' with a timestamped filename
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Serve static files from the uploads directory at /files route
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// POST /upload endpoint: handle single file upload (field name 'pdf')
app.post('/upload', upload.single('pdf'), (req, res) => {
    if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Construct the URL to access the uploaded file
  const fileUrl = `http://localhost:${PORT}/files/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
