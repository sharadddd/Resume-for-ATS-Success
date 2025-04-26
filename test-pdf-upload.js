import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

// This script tests the server's ability to process PDF uploads
// You'll need to have a sample PDF file in the project directory

async function testPdfUpload() {
  try {
    console.log('Testing PDF upload and processing...');
    
    // Check if sample PDF exists
    const pdfPath = path.resolve('sample-resume.pdf');
    if (!fs.existsSync(pdfPath)) {
      console.error('Error: sample-resume.pdf not found in project directory');
      console.log('Please create or copy a sample PDF file named "sample-resume.pdf" to the project directory');
      return;
    }
    
    // Create form data with PDF file
    const formData = new FormData();
    formData.append('resume', fs.createReadStream(pdfPath));
    formData.append('jobDescription', 'This is a test job description for a software developer position requiring skills in JavaScript, React, Node.js, and TypeScript.');
    formData.append('promptType', 'match');
    
    console.log('Sending request to server...');
    const response = await axios.post('http://localhost:5000/analyze', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000,
    });
    
    console.log('Server response status:', response.status);
    console.log('Server response headers:', response.headers);
    
    if (response.data.error) {
      console.error('Server returned error:', response.data.error);
    } else if (response.data.result) {
      console.log('Server returned result (first 200 chars):', response.data.result.substring(0, 200) + '...');
      console.log('Test successful!');
    } else {
      console.error('Unexpected response format:', response.data);
    }
    
  } catch (error) {
    console.error('Error during test:', error.message);
    
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    }
  }
}

testPdfUpload();