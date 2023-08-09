import React, { useState, useEffect } from "react";
import "./blogForm.css";
import BlogList from "../BlogList/bloglist";

const BlogForm = ({ userToken }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [newBlogId, setNewBlogId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`http://localhost:5001/blogs`);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5001/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewBlogId(data.blogId);

        setBlogs((prevBlogs) => [
          ...prevBlogs,
          { id: data.blogId, title, content, comments: [] },
        ]);

        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="blog-form">
      <form onSubmit={handleSubmit}>
        <h1>Create your Blog and Post here</h1>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            className="blog-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button className="blog-submit" type="submit">
          Submit
        </button>
      </form>

      <BlogList
        blogs={blogs}
        userToken={userToken}
        onCommentSubmit={fetchBlogs} // Update the display after a comment is submitted
      />
    </div>
  );
};

export default BlogForm;
