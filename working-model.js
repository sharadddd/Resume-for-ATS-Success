import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testWorkingModel() {
    try {
        console.log('Testing working model...');

        // Initialize the API with a working model
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Generate content
        const result = await model.generateContent('What are the benefits of AI in healthcare?');
        const response = result.response;
        const text = response.text();

        console.log('Response:');
        console.log(text);

    } catch (error) {
        console.error('Error:', error);
    }
}

testWorkingModel();