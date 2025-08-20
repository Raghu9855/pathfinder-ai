import React from "react";
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Navbar from '../pages/Navbar';
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage"; 
import { AuthProvider } from '../context/AuthContext';

function App()  {
  return(
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;