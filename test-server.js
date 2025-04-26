import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';
import PDFDocument from 'pdfkit';

// Create a sample PDF file for testing
const createSamplePDF = () => {
    const filePath = path.resolve('sample.pdf');
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(16).text('John Doe', { align: 'center' });
    doc.fontSize(12).text('Software Engineer', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('Experience');
    doc.fontSize(10).text('ABC Company - Senior Developer (2018-2022)');
    doc.fontSize(10).text('- Developed web applications using React and Node.js');
    doc.fontSize(10).text('- Led a team of 5 developers');
    doc.moveDown();
    doc.fontSize(14).text('Skills');
    doc.fontSize(10).text('JavaScript, React, Node.js, Express, MongoDB, Git');
    doc.moveDown();
    doc.fontSize(14).text('Education');
    doc.fontSize(10).text('Bachelor of Science in Computer Science, XYZ University (2014-2018)');
    doc.end();

    return new Promise((resolve) => {
        stream.on('finish', () => {
            resolve(filePath);
        });
    });
};

async function testServer() {
    try {
        console.log('Testing server API...');

        // Create a sample PDF file
        const pdfPath = await createSamplePDF();
        console.log('Created sample PDF file at:', pdfPath);

        // Create form data
        const formData = new FormData();
        formData.append('resume', fs.createReadStream(pdfPath));
        formData.append('jobDescription', 'Software Engineer with 3+ years of experience in JavaScript and Node.js');

        console.log('Sending request to server...');
        const response = await axios.post('http://localhost:3000/analyze', formData, {
            headers: {
                ...formData.getHeaders(),
            },
            timeout: 30000,
        });

        console.log('Response from server:');
        console.log(JSON.stringify(response.data, null, 2));

        // Clean up
        fs.unlinkSync(pdfPath);
    } catch (error) {
        console.error('Error testing server:', error.response ? error.response.data : error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        console.error('Full error:', error);
    }
}

testServer();