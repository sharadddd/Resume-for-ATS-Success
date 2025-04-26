import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Simple health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Simple server is running' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Simple server running on port ${PORT}`);
});