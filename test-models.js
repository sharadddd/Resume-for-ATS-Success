import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testModels() {
    try {
        console.log('Testing Google Generative AI models...');

        // Initialize the API
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

        // List of models to test
        const models = [
            'gemini-pro',
            'gemini-1.0-pro',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-1.5-pro-latest',
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash-8b',
            'gemini-1.5-flash-8b-latest',
            'gemini-2.0-flash',
            'gemini-2.0-flash-001',
            'gemini-2.0-flash-lite',
            'gemini-2.0-flash-lite-001'
        ];

        // Test each model
        for (const modelName of models) {
            try {
                console.log(`Testing model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello, world!');
                console.log(`✅ Model ${modelName} works! Response: ${result.response.text().substring(0, 50)}...`);
            } catch (error) {
                console.log(`❌ Model ${modelName} failed: ${error.message}`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testModels();