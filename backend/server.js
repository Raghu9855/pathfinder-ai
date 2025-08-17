import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { connectDB }  from "./config/db.js";  
import userRoutes from './routes/userRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';

// --- Basic Server Setup ---
const app = express();
const port = process.env.PORT || 5001;
app.use(express.json());
configDotenv(); // This loads environment variables from a .env file
connectDB(); 



app.use(cors());


app.use("/api/users", userRoutes);
app.use("/api", roadmapRoutes);


// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running successfully on http://localhost:${port}`);
});
