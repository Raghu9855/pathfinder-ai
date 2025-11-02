# PathFinder AI

**Frontend (Vercel):** [https://pathfinder-ai-ten.vercel.app](https://pathfinder-ai-ten.vercel.app)

**Backend (Render):** [https://pathfinder-ai-backend.onrender.com](https://pathfinder-ai-backend.onrender.com)

**GitHub Repo:** [https://github.com/Raghu9855/pathfinder-ai](https://github.com/Raghu9855/pathfinder-ai)

-----

## 💡 Project Overview

This project is a full-stack web application called **PathFinder AI**, designed to help users generate, manage, and share personalized learning roadmaps. Leveraging the power of generative AI, the application creates structured, week-by-week learning plans on any topic.

Users can track their progress, find external learning resources, and interact with an AI mentor for guidance. The application also features a community Q\&A forum and a gamified leaderboard to encourage learning and collaboration. The entire application is built with a **MERN (MongoDB, Express, React, Node.js)** stack.

-----

## ✨ Key Features

  * **User Authentication:** A secure and robust account system using **JSON Web Tokens (JWT)** for session management and **bcrypt** to hash all user passwords.
  * **AI-Powered Roadmap Generation:** Uses the **Google Gemini API** to generate detailed, multi-week learning roadmaps on any given topic.
  * **Personalized Dashboard:** A private dashboard for logged-in users to view, manage, and delete their saved roadmaps.
  * **Progress Tracking:** Users can check off concepts as they complete them, and this progress is saved to their account.
  * **AI Mentor Chat:** A persistent, per-roadmap chat interface. It leverages the **Google Gemini API** and a `ChatSession` model to provide context-aware guidance and store chat history.
  * **Resource Finder:** An integrated **Google Custom Search API** feature. A "Find Resources" button on each roadmap concept dynamically searches for relevant tutorials, videos, and articles.
  * **Community Q\&A:** A full community forum where users can ask topic-specific questions.
      * **AI Moderation:** New questions are pre-processed by the AI to generate clean titles, relevant tags, and an initial AI-generated answer.
      * **Voting System:** Users can post their own answers and upvote the most helpful ones.
  * **Public Leaderboard:** A gamified, public leaderboard that ranks the top 10 users based on the total number of concepts they have completed across all their roadmaps.
  * **Shareable Roadmaps:** Users can generate a unique, public URL for any roadmap, allowing them to share their learning plans with others.
  * **Responsive Design:** A clean, mobile-first UI that works seamlessly on both desktop and mobile devices.
  * **Theme Toggler:** A light/dark mode theme toggler with state persisted in `localStorage`.

-----

## 🛠️ Tech Stack

### Frontend

  * **React:** For building a dynamic and responsive user interface.
  * **React Router:** For client-side navigation and routing.
  * **React Context:** To manage global user authentication and theme state.
  * **React Markdown:** To render AI-generated content (roadmaps, chat, answers) from Markdown to HTML.
  * **React Icons:** For UI icons.

### Backend

  * **Node.js & Express.js:** To build a high-performance RESTful API.
  * **MongoDB & Mongoose:** A NoSQL database and Object Data Modeling (ODM) library for all data persistence (users, roadmaps, chat sessions, questions, answers).
  * **JSON Web Tokens (JWT):** For secure session management.
  * **bcrypt.js:** For securely hashing user passwords.

### External APIs

  * **Google Gemini API:** The core AI service for generating roadmaps, chat responses, and Q\&A content.
  * **Google Custom Search API:** Used to find external learning resources for roadmap concepts.

### Deployment & Tools

  * **Git & GitHub:** For version control.
  * **Vercel:** Used to deploy and host the live frontend application.
  * **Render:** Used to deploy and host the live backend API server.

-----

## 📂 Project File Structure

```
pathfinder-ai/
├── backend/
│   ├── config/
│   │   └── db.js             // Database connection logic
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── roadmapController.js  // Logic for roadmaps, chat, resources, leaderboard
│   │   └── questionController.js // Logic for Q&A and answers
│   ├── middleware/
│   │   └── authMiddleware.js   // JWT protection middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── roadmap.js
│   │   ├── chatSession.js    // Schema for persistent chat history
│   │   ├── question.js       // Schema for Q&A questions
│   │   └── answer.js         // Schema for Q&A answers
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── roadmapRoutes.js
│   │   └── questionRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js           // Express server entry point
├── public/
├── src/
│   ├── components/
│   │   ├── App.js
│   │   ├── ChatMentor.js
│   │   ├── ProtectedRoute.js
│   │   ├── ResourceModal.js  // Modal for displaying search results
│   │   ├── RoadmapDisplay.js // Core component for showing a roadmap
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── pages/
│   │   ├── DashboardPage.js    // Main roadmap generation page
│   │   ├── MyRoadmapsPage.js   // User's saved roadmaps list
│   │   ├── MentorPage.js       // Hosts the ChatMentor component
│   │   ├── LeaderboardPage.js
│   │   ├── QAPage.js           // Community Q&A main page
│   │   ├── QuestionDetailPage.js
│   │   ├── ShareableRoadmapPage.js // Public-facing page for shared links
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   └── ...
│   ├── App.css
│   ├── index.css
│   └── index.js
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

-----

## 🚀 Project Setup and Installation

Follow these steps to run the project locally on your machine.

**You'll Need:**

  * Node.js (and npm)
  * A MongoDB Atlas account (for the database)
  * A Google AI Studio API Key (for Gemini)
  * A Google Custom Search API Key & Search Engine ID

**1. Clone the repository**

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

Create a `.env` file in the `backend` directory with your credentials:

```
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=a_random_string_for_jwt
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
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

Create a `.env.local` file in the project root (`pathfinder-ai/`):

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

### User Routes

  * `POST /api/users/register`: Register a new user.
  * `POST /api/users/login`: Authenticate and log in a user.

### Roadmap & Mentor Routes

  * `POST /api/roadmap`: Create a new AI-generated roadmap (Private).
  * `GET /api/roadmaps`: Get all roadmaps for the logged-in user (Private).
  * `DELETE /api/roadmaps/:id`: Delete a specific roadmap (Private).
  * `POST /api/roadmaps/:id/progress`: Update a roadmap's completed concepts (Private).
  * `POST /api/roadmap/resources`: Find external resources for a concept (Private).
  * `POST /api/roadmap/:id/share`: Create a public shareable link (Private).
  * `GET /api/roadmap/share/:shareableId`: Get a public, shared roadmap (Public).
  * `GET /api/chat/:roadmapId`: Get chat history for a roadmap (Private).
  * `POST /api/chat/:roadmapId`: Post a new message to a chat session (Private).
  * `GET /api/leaderboard`: Get the public top 10 leaderboard (Public).

### Community Q\&A Routes

  * `POST /api/questions`: Create a new question with an initial AI answer (Private).
  * `GET /api/questions`: Get all questions (Public).
  * `GET /api/questions/:id`: Get one question with all its answers (Public).
  * `POST /api/questions/:questionId/answers`: Add a new human answer (Private).
  * `POST /api/questions/answers/:answerId/upvote`: Upvote/toggle upvote on an answer (Private).

-----

## 🌐 Live Application

The project is deployed and live on the web at the following addresses:

  * **Frontend:** `https://pathfinder-ai-ten.vercel.app`
  * **Backend API:** `https://pathfinder-ai-backend.onrender.com`

-----

## ✒️ Author

**Raghavendra K** - [GitHub](https://github.com/Raghu9855) - [LinkedIn](www.linkedin.com/in/raghk)
