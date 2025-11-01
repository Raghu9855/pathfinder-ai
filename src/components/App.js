import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from '../pages/Navbar';
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage"; // <-- Your search page
import MyRoadmapsPage from "../pages/MyRoadmapsPage"; // <-- Your new list page
import LeaderboardPage from "../pages/LeaderboardPage";
import MentorPage from "../pages/MentorPage";
import ShareableRoadmapPage from "../pages/ShareableRoadmapPage";
import IndexPage from "../pages/IndexPage";
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Protected Routes (Need Login, Have Navbar) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/roadmaps" element={<MyRoadmapsPage />} /> {/* <-- New route */}
            <Route path="/mentor" element={<MentorPage />} />
          </Route>

          {/* --- Public-Only Routes (No Navbar) --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* --- Public Routes (Have Navbar) --- */}
          <Route 
            path="/leaderboard"
            element={
              <>
                <Navbar /> 
                <LeaderboardPage />
              </>
            } 
          />
          <Route 
            path="/roadmap/share/:shareableId" 
            element={
              <>
                <Navbar /> 
                <ShareableRoadmapPage />
              </>
            } 
          />
          
          {/* --- Index/Root Route (Redirector) --- */}
          <Route path="/" element={<IndexPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;