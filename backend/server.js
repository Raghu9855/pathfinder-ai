import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { connectDB }  from "./config/db.js";  
import userRoutes from './routes/userRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
configDotenv(); // This loads environment variables from a .env file
// --- Basic Server Setup ---
const app = express();
const port = process.env.PORT || 5001;
app.use(express.json());

connectDB(); 



app.use(cors());
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set. Please create a new .env file with your working key.");
}


app.use("/api/users", userRoutes);
app.use("/api", roadmapRoutes);


// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running successfully on http://localhost:${port}`);
});
