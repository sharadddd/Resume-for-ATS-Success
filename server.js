import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import pdf from 'pdf-parse';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Validate environment variables
if (!process.env.GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY is not set in environment variables');
  process.exit(1);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve('uploads');
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir);
      } catch (err) {
        console.error('Error creating uploads directory:', err);
        return cb(err);
      }
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// Using gemini-1.5-flash model which is confirmed to work with our API key
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    console.log('Received analyze request');

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No resume file uploaded' });
    }
    console.log('File uploaded:', req.file.path);

    const jobDescription = req.body.jobDescription;
    if (!jobDescription) {
      console.error('Job description is missing');
      return res.status(400).json({ error: 'Job description is required' });
    }
    console.log('Job description received:', jobDescription);

    const filePath = path.resolve(req.file.path);
    if (!fs.existsSync(filePath)) {
      console.error('Uploaded file not found at path:', filePath);
      return res.status(404).json({ error: 'Uploaded file not found' });
    }
    console.log('File exists at path:', filePath);

    // Read and parse the PDF file
    let resumeText;
    try {
      const dataBuffer = fs.readFileSync(filePath);
      console.log('File read successfully, size:', dataBuffer.length, 'bytes');

      const pdfData = await pdf(dataBuffer);
      resumeText = pdfData.text;
      console.log('Resume text extracted, length:', resumeText.length);
    } catch (pdfError) {
      console.error('Error parsing PDF:', pdfError);
      return res.status(400).json({ error: 'Error parsing PDF file', details: pdfError.message });
    }

    // Prepare prompt for analysis
    const prompt = `Analyze this resume against the following job description and provide detailed feedback:

Resume Content:
${resumeText}

Job Description:
${jobDescription}

Please provide:
1. Overall match score (0-100)
2. Keyword match analysis
3. Missing key skills or qualifications
4. Specific improvement suggestions
5. Section-by-section analysis (Experience, Skills, Education)`;

    // Generate analysis using Gemini
    console.log('Sending prompt to Gemini API...');
    let analysis;
    try {
      console.log('Using model:', model);

      // Add a simple test to verify the model is working
      try {
        const testResult = await model.generateContent('Test: What is 2+2?');
        const testResponse = await testResult.response;
        console.log('Test API call successful:', testResponse.text());
      } catch (testError) {
        console.error('Test API call failed:', testError);
        throw new Error(`API test failed: ${testError.message}`);
      }

      // Now try the actual prompt
      console.log('Sending actual prompt to API...');
      const result = await model.generateContent(prompt);
      console.log('Result received:', JSON.stringify(result, null, 2));

      const response = await result.response;
      console.log('Response object received');

      analysis = response.text();
      console.log('Analysis text extracted:', analysis.substring(0, 100) + '...');

      if (!analysis || analysis.trim() === '') {
        throw new Error('Received empty response from Gemini API');
      }

      console.log('Successfully received response from Gemini API');
    } catch (apiError) {
      console.error('Gemini API Error Details:', apiError);
      console.error('Error name:', apiError.name);
      console.error('Error message:', apiError.message);
      console.error('Error stack:', apiError.stack);
      return res.status(500).json({
        error: 'Error analyzing resume with AI',
        details: apiError.message,
        name: apiError.name
      });
    }

    console.log('Analysis result:', analysis);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({ result: analysis });
  } catch (error) {
    console.error('Error processing request:', error);

    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Send appropriate error response
    if (error.message.includes('Only PDF files are allowed')) {
      res.status(400).json({ error: 'Only PDF files are allowed' });
    } else if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File size exceeds 5MB limit' });
    } else {
      res.status(500).json({ error: 'Error analyzing resume', details: error.message });
    }
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir);
  } catch (err) {
    console.error('Error creating uploads directory:', err);
    process.exit(1);
  }
}

// Add a simple health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Add a test route for the Gemini API
app.get('/test-api', async (req, res) => {
  try {
    const testResult = await model.generateContent('Test: What is 2+2?');
    const testResponse = await testResult.response;
    res.json({
      status: 'ok',
      message: 'API is working',
      result: testResponse.text()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'API test failed',
      error: error.message
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
