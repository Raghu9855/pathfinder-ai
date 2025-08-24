import { useNavigate } from "react-router-dom"; 
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
  const { login } = useContext(AuthContext); 

  const handleRegister = async (e) => {
    e.preventDefault();
    const url=`${process.env.REACT_APP_API_URL}/api/users/register`;
    try {
        const response=await fetch(url,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({ name, email, password })
        });
          const Data=await response.json();
          if (response.ok) {
                localStorage.setItem("token", Data.token);
                navigate("/");
                login(Data.user);
            }else{
                alert(Data.message || "Registration failed");
            }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Try again.");
      }

  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-form-container">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

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

          <button type="submit">Register</button>
        </form>
        <p className="auth-switch-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
