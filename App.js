import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm/loginfrom";
import SignupForm from "./SignupForm/signupform";
import BlogForm from "./BlogForm/blogform";
import "./App.css";

const storedToken = localStorage.getItem('userToken'); // Retrieve token from localStorage
function App() {
  const [userToken, setUserToken] = useState(storedToken || ""); // Use the stored token if available
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={<SignupForm setUserToken={setUserToken}  />}
          />
          <Route
            path="/login"
            element={<LoginForm setUserToken={setUserToken} />}
          />
          <Route
            path="/blogs"
            element={<BlogForm userToken={userToken} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
