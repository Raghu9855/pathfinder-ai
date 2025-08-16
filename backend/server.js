import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { configDotenv } from 'dotenv';

// --- Basic Server Setup ---
const app = express();
const port = 5001;
app.use(express.json());

app.use(cors());
configDotenv(); // This loads environment variables from a .env file

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set. Please create a new .env file with your working key.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// --- API Route for Generating a Roadmap ---
app.post('/api/roadmap', async (req, res) => {
    const { topic } = req.body;

    // Basic validation to ensure a topic was provided
    if (!topic) {
        return res.status(400).json({ error: "The 'topic' field is required." });
    }

    try {
        // 1. Use the model that we confirmed is working from the test script.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // 2. Craft the prompt
        const prompt = `Create a detailed, 4-week learning roadmap for a beginner on the topic of '${topic}'. For each week, provide a main focus and 3-4 key concepts to learn.`;

        // 3. Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // 4. Extract the text from the response
        const text = response.text();
        
        // Send the generated roadmap back to the client
        res.json({ roadmap: text });

    } catch (error) {
        // Log the full error for debugging on the server
        console.error("Error generating roadmap:", error);
        // Send a generic error message to the client
        return res.status(500).json({ error: "Failed to generate roadmap" });
    }
});

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running successfully on http://localhost:${port}`);
});
