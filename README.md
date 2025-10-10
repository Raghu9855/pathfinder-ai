# PathFinder AI

**Frontend (Vercel):** [https://pathfinder-ai-ten.vercel.app](https://pathfinder-ai-ten.vercel.app)

**Backend (Render):** [https://pathfinder-ai-backend.onrender.com](https://pathfinder-ai-backend.onrender.com)

**GitHub Repo:** [https://github.com/Raghu9855/pathfinder-ai](https://github.com/Raghu9855/pathfinder-ai)

-----

## 💡 Project Overview

This project is a full-stack web application called **PathFinder AI**, designed to help users generate and manage personalized learning roadmaps. Leveraging the power of generative AI, the application creates structured, week-by-week learning plans on any topic, which are then saved to a user's account for future reference. The entire application is built with a **MERN (MongoDB, Express, React, Node.js)** stack, demonstrating a comprehensive set of modern web development skills.

-----

## ✨ Key Features

  * **User Authentication:** A secure and robust account system that allows users to register, log in, and log out. It uses **JSON Web Tokens (JWT)** for session management and **bcrypt** to securely hash all user passwords.
  * **AI-Powered Generation:** The core functionality, powered by the **Google Gemini API**, generates detailed, customizable learning roadmaps on a wide range of topics.
  * **Persistent Data Storage:** All generated roadmaps are stored in a **MongoDB** database, linked directly to the user's account. This ensures data is persistent and can be accessed across sessions.
  * **Personalized Dashboard:** A private dashboard for logged-in users to view, manage, and delete their previously saved roadmaps, creating a personalized learning library.
  * **Responsive Design:** The user interface is built to be clean, modern, and fully responsive, providing a seamless experience on both desktop and mobile devices.
  * **Theme Toggler:** The application includes a theme toggler that allows users to switch between light and dark modes for a comfortable viewing experience.

-----

## 🛠️ Tech Stack

### Frontend

  * **React:** For building a dynamic and responsive user interface.
  * **React Router:** For client-side navigation and routing within the application.
  * **React Context:** To manage the global user authentication and theme state, avoiding "prop drilling."
  * **React Markdown:** To render the generated roadmaps from Markdown to HTML.
  * **React Icons:** For including icons in the user interface.

### Backend

  * **Node.js & Express.js:** To build a high-performance RESTful API that handles all business logic.
  * **MongoDB & Mongoose:** A NoSQL database and an Object Data Modeling (ODM) library for reliable data storage and retrieval.
  * **JSON Web Tokens (JWT):** For secure session management.
  * **bcrypt.js:** For securely hashing user passwords.

### External APIs

  * **Google Gemini API:** The core AI service for generating the learning content.

### Deployment & Tools

  * **Git & GitHub:** For version control and collaborative development.
  * **Vercel:** Used to deploy and host the live frontend application.
  * **Render:** Used to deploy and host the live backend API server.

-----

## 📂 Project File Structure

```
pathfinder-ai/
├── backend/                // Node.js/Express.js backend
│   ├── config/             // Database configuration
│   ├── controllers/        // Application logic for handling requests
│   ├── middleware/         // Authentication middleware
│   ├── models/             // Mongoose schemas for User and Roadmap
│   ├── routes/             // API route definitions
│   ├── .env                // Backend environment variables
│   ├── package.json
│   └── server.js           // The main backend server file
├── public/                 // Static assets (index.html, favicon, etc.)
├── src/                    // React source code
│   ├── components/         // Reusable React components
│   ├── context/            // Global state for Authentication and Theme
│   ├── pages/              // Main page components (Home, Login, Register)
│   ├── App.css
│   ├── App.js              // Main application component with routing
│   ├── index.css
│   └── index.js            // App entry point
├── .env.local              // Frontend environment variables
├── .gitignore              // Specifies files to ignore
├── package.json            // Frontend project manifest
└── README.md
```

-----

## 🚀 Project Setup and Installation

Follow these steps to run the project locally on your machine.

**You'll Need:**

  * Node.js (and npm)
  * A MongoDB Atlas account (for the database)
  * A Google AI Studio API Key (for the AI)

**1. Clone the repository**
First, get the code onto your computer.

```bash
git clone https://github.com/Raghu9855/pathfinder-ai.git
cd pathfinder-ai
```

**2. Backend Setup**
Navigate to the `backend` directory, install dependencies, and create a `.env` file.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your backend credentials:

```
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=a_random_string_for_jwt
```

Start the backend server:

```bash
npm start
```

**3. Frontend Setup**
Open a new terminal at the project root (`cd ..`), install dependencies, and create an `.env.local` file for the frontend.

```bash
npm install
```

Create a `.env.local` file in the project root (`pathfinder-ai/`) for your frontend's environment variable:

```
REACT_APP_API_URL=http://localhost:5001
```

Start the frontend development server:

```bash
npm start
```

-----

## 🗺️ API Endpoints

The backend API provides the following endpoints:

  * `POST /api/users/register`: Register a new user.
  * `POST /api/users/login`: Authenticate and log in a user.
  * `POST /api/roadmap`: Create a new roadmap (protected route).
  * `GET /api/roadmaps`: Get all roadmaps for the logged-in user (protected route).
  * `DELETE /api/roadmaps/:id`: Delete a specific roadmap for the logged-in user (protected route).

-----

## 🌐 Live Application

The project is deployed and live on the web at the following addresses:

  * **Frontend:** `https://pathfinder-ai-ten.vercel.app`
  * **Backend API:** `https://pathfinder-ai-backend.onrender.com`

-----

## ✒️ Author

**Raghavendra K** - [GitHub](https://github.com/Raghu9855) - [LinkedIn](www.linkedin.com/in/raghk)
