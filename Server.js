const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
const port = 5001;
const jwt = require("jsonwebtoken");

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'new_password',
    database: 'triluxo',
});

// Middleware to parse incoming JSON data
app.use(bodyParser.json());
const jwtSecretKey = "tru";

// API endpoint for user signup
app.post("/comments", verifyUser, (req, res) => {
  const { blogId, content } = req.body;
  const userId = req.user.id;

  const query = "INSERT INTO comments (blog_id, user_id, content) VALUES (?, ?, ?)";
  pool.query(query, [blogId, userId, content], (err, result) => {
    if (err) {
      console.error("Error saving the comment:", err);
      return res.status(500).json({ message: "Failed to save the comment." });
    }

    console.log("Comment saved successfully:", result);
    return res.status(200).json({ message: "Comment submitted successfully." });
  });
});

app.get("/comments/:blogId", (req, res) => {
  const { blogId } = req.params;

  const query = "SELECT * FROM comments WHERE blog_id = ?";
  pool.query(query, [blogId], (err, results) => {
    if (err) {
      console.error("Error retrieving comments:", err);
      return res.status(500).json({ message: "Failed to retrieve comments." });
    }

    return res.status(200).json(results);
  });
});

app.post("/blogs", verifyUser, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  const query = "INSERT INTO blogs (title, content, user_id) VALUES (?, ?, ?)";
  pool.query(query, [title, content, userId], (err, result) => {
    if (err) {
      console.error("Error saving the blog:", err);
      return res.status(500).json({ message: "Failed to save the blog." });
    }
    const newBlogId = result.insertId; // Get the newly inserted blog's ID

    console.log("Blog saved successfully:", result);
    return res.status(200).json({ message: "Blog submitted successfully.",blogId: newBlogId });
  });
});

  function verifyUser(req, res, next) {
    const token = req.header("Authorization");
  
    if (!token) {
      return res.status(403).json({ message: "No token provided." });
    }
  
    jwt.verify(token.split(" ")[1], jwtSecretKey, (err, user) => {      
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ message: "Invalid token." });
      }
  
      req.user = user;
      next();
    });
  }
  
  app.post("/signup", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
  
    // Check if the email is already registered
    pool.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
      if (error) throw error;
  
      if (results.length > 0) {
        return res.status(409).json({ message: "Email already registered." });
      }
  
      // Insert new user into the database
      pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, password], (error, results) => {
        if (error) throw error;
  
        // Create a JWT token for the new user
        const user = { id: results.insertId, email }; // Assuming "insertId" is the ID of the newly inserted user
        const token = jwt.sign(user, jwtSecretKey);
  
        return res.status(201).json({ message: "User registered successfully.", token });
      });
    });
  });
  app.get("/blogs", (req, res) => {
    const query = "SELECT * FROM blogs";
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Error retrieving blogs:", err);
        return res.status(500).json({ message: "Failed to retrieve blogs." });
      }
  
      return res.status(200).json(results);
    });
  });
  

// API endpoint for user login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  // Check if the email and password match any user in the database
  pool.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Create a JWT token for the authenticated user
    const user = { id: results[0].id, email }; // Assuming "id" is the column for user ID
    const token = jwt.sign(user, jwtSecretKey);

    return res.status(200).json({ message: "Login successful.", token });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
