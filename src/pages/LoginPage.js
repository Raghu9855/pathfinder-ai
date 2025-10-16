import { useNavigate, Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/api/users/login`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const Data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", Data.token);
        login(Data.user);
        navigate("/");
      } else {
        alert(Data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* --- Creative Introduction Section --- */}
      <div className="intro-container">
        <div className="intro-logo">PathFinder AI</div>
        <h1>Unlock Your Learning Potential.</h1>
        <p>
          Generate AI-powered roadmaps for any skill, from coding to cooking. Your personalized learning journey starts here.
        </p>
      </div>

      {/* --- Login Form Section --- */}
      <div className="auth-form-container">
        <h2>Welcome Back</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="auth-switch-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;