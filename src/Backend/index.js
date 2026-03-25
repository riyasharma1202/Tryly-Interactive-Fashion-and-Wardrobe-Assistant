// server.js (Backend - Express)
const express = require('express');
const cors = require('cors');
const multer = require('multer'); // for handling image uploads
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(cors());

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// API endpoint to upload the captured image and forward to Python API
app.post('/upload', upload.single('image'), async (req, res) => {
  if (req.file) {
    try {
      const form = new FormData();
      form.append('image', fs.createReadStream(req.file.path));

      const response = await axios.post('http://localhost:6000/analyze', form, {
        headers: form.getHeaders(),
      });

      // Delete the uploaded file after forwarding
      fs.unlinkSync(req.file.path);

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error processing image' });
    }
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
