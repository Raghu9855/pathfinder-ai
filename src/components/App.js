import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import MyRoadmapsPage from "../pages/MyRoadmapsPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import MentorPage from "../pages/MentorPage";
import ShareableRoadmapPage from "../pages/ShareableRoadmapPage";
import IndexPage from "../pages/IndexPage";
import QAPage from "../pages/QAPage";
import QuestionDetailPage from "../pages/QuestionDetailPage";
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected Routes (Wrapped in Layout with Navbar) */}
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/roadmaps" element={<MyRoadmapsPage />} />
              <Route path="/mentor" element={<MentorPage />} />
            </Route>
          </Route>

          {/* Public Routes with Navbar */}
          <Route element={<Layout />}>
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route
              path="/roadmap/share/:shareableId"
              element={<ShareableRoadmapPage />}
            />
            <Route path="/community" element={<QAPage />} />
            <Route path="/community/:id" element={<QuestionDetailPage />} />
          </Route>

          {/* Public Routes without Navbar */}
          <Route element={<Layout withNavbar={false} />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<IndexPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;