import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY is not set in environment variables');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function listModels() {
    try {
        // This is a workaround since there's no direct API to list models
        // We'll try different models and see which ones work
        const models = [
            'gemini-pro',
            'gemini-1.0-pro',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-1.5-pro-latest',
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash-8b',
            'gemini-1.5-flash-8b-latest'
        ];

        console.log('Testing models...');

        for (const modelName of models) {
            try {
                console.log(`Testing model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello, what models are available?');
                console.log(`✅ Model ${modelName} is available`);
            } catch (error) {
                console.log(`❌ Model ${modelName} is not available: ${error.message}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();