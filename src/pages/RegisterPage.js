import { useNavigate } from "react-router-dom"; 
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
  const { login } = useContext(AuthContext); 

  const handleRegister = async (e) => {
    e.preventDefault();
    const url='http://localhost:5001/api/users/register';
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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
