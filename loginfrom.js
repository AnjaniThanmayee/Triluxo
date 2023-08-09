import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './loginfrom.css'
const API_URL = 'http://localhost:5001';

const LoginForm = ({ setUserToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      
      const data = await response.json();
      // Inside your LoginForm component after successful login
        if (data.message === 'Login successful.') {
          localStorage.setItem('userToken', data.token); // Store the token in localStorage
          setUserToken(data.token);
          navigate('/blogs');
        }

      setErrorMessage(data.message)
      console.log(data.token);
      
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
  };
  const navigate = useNavigate();

  return (
    <form className="form-container" onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
