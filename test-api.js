import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY is not set in environment variables');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function testAPI() {
    try {
        console.log('Testing Gemini API...');
        const prompt = 'Write a short paragraph about resume analysis.';

        console.log('Sending prompt to Gemini API...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Response from Gemini API:');
        console.log(text);
    } catch (error) {
        console.error('Error testing API:', error);
    }
}

testAPI();