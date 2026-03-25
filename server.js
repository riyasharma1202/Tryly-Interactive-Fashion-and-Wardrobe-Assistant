import express from 'express';
import cors from 'cors';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Setup multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// ADD YOUR REAL API KEY HERE
const GEMINI_API_KEY = 'AIzaSyDLVFvzR30rd4SEWX16LZUxiQomcDRy7iM'; // REPLACE THIS

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'AIzaSyDLVFvzR30rd4SEWX16LZUxiQomcDRy7iM') {
  console.log('📝 Warning: GEMINI_API_KEY is not set. Get your key at: https://aistudio.google.com/app/apikey');
}

// Old 2D Demo Endpoint
app.post('/api/virtual-tryon', async (req, res) => {
  try {
    const { userImage, garmentImage } = req.body;
    await new Promise(resolve => setTimeout(resolve, 2000));
    res.json({ 
      success: true, 
      resultImage: userImage,
      note: 'Demo mode - 2D try-on'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// New AI-Based VTON Proxy Endpoint
app.post('/api/virtual-tryon/ai', upload.fields([{name: 'userImage'}, {name: 'garmentImage'}]), async (req, res) => {
  try {
    console.log('📥 Received REAL AI try-on request');
    
    if (!req.files || !req.files.userImage || !req.files.garmentImage) {
      return res.status(400).json({ success: false, error: "Missing images" });
    }

    const form = new FormData();
    form.append('user_image', req.files.userImage[0].buffer, 'user.jpg');
    form.append('garment_image', req.files.garmentImage[0].buffer, 'garment.jpg');

    console.log('🔄 Forwarding to Python ML Microservice (Port 8000)...');
    
    // Call the Python Microservice running on port 8000
    // Make sure your Python FastAPI server is running!
    const pythonResponse = await axios.post('http://localhost:8000/generate-vton', form, {
      headers: form.getHeaders(),
      responseType: 'arraybuffer' // We want the raw image binary back
    });

    console.log('✅ Received generated image from Python AI!');
    
    // Send the generated image directly back to React
    res.set('Content-Type', 'image/jpeg');
    res.send(pythonResponse.data);

  } catch (error) {
    console.error('❌ AI Server proxy error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to connect to Python VTON Service. Ensure app.py is running on port 8000.' 
    });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Node.js Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to proxy AI TryOn requests to Python Server (Port 8000)`);
});
