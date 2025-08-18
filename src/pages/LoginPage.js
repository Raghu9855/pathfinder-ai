import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

    const handleLogin = async (e) => {
    e.preventDefault();
    const url='http://localhost:5001/api/users/login';
    try {
        const response=await fetch(url,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({ email, password })
        });
          const Data=await response.json();
          if (response.ok) {
                localStorage.setItem("token", Data.token);
                navigate("/");
            }else{
                alert(Data.message || "Login failed");
            }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Try again.");
      }

  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
