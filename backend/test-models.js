import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    const models = [
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro-001",
        "gemini-1.5-pro-002"
    ];

    for (const m of models) {
        console.log(`Testing ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("Hi");
            console.log(`SUCCESS: ${m} worked!`);
            return;
        } catch (e) {
            console.log(`FAIL: ${m} - ${e.message.split(':')[0]} ...`); // Log simplified error
        }
    }
}

test();
