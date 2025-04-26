import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testApiKey() {
    try {
        console.log('Testing API key...');

        if (!process.env.GOOGLE_API_KEY) {
            console.error('GOOGLE_API_KEY is not set in environment variables');
            process.exit(1);
        }

        console.log('API Key found in environment variables');

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        console.log('GoogleGenerativeAI instance created');

        // Try to list models if available
        try {
            console.log('Attempting to list available models...');
            const modelList = await genAI.listModels();
            console.log('Available models:', modelList);
        } catch (listError) {
            console.log('Could not list models:', listError.message);
        }

        // Test with gemini-pro model
        try {
            console.log('Testing with gemini-pro model...');
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            console.log('Model instance created');

            const result = await model.generateContent('Hello, what is 1+1?');
            console.log('API Response received');
            const response = await result.response;
            const text = response.text();
            console.log('Response text:', text);
            console.log('API key is working correctly with gemini-pro model');
        } catch (error) {
            console.error('Error testing gemini-pro model:', error);
            console.error('Error message:', error.message);
        }

        // Test with gemini-1.5-flash model
        try {
            console.log('\nTesting with gemini-1.5-flash model...');
            const flashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            console.log('Model instance created');

            const result = await flashModel.generateContent('Hello, what is 2+2?');
            console.log('API Response received');
            const response = await result.response;
            const text = response.text();
            console.log('Response text:', text);
            console.log('API key is working correctly with gemini-1.5-flash model');
        } catch (error) {
            console.error('Error testing gemini-1.5-flash model:', error);
            console.error('Error message:', error.message);
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

testApiKey();