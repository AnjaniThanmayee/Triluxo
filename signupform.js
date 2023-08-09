import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./signupform.css";
import { useNavigate } from 'react-router-dom'; 
const API_URL = "http://localhost:5001";

const SignupForm = ({ setUserToken }) => {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

        const data = await response.json();
        

      // Inside your LoginForm component after successful login
      if (data.message === "User registered successfully.") {
        localStorage.setItem('userToken', data.token); // Store the token in localStorage
        setUserToken(data.token);
        navigate('/blogs');
      }

      setErrorMessage(data.message)

      console.log(data.token)
    } catch (error) {
      console.error(error.message);
      setErrorMessage("Signup failed. Please try again.");
    }
  };
  const navigate = useNavigate();

  return (
    <form className="form-container" onSubmit={handleSignup}>
      <h2>Signup</h2>
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
      <button type="submit">Signup</button>
      <p>
        Already have an account?{" "}
        <Link to="/login">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
