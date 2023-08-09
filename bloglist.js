import React, { useState, useEffect } from "react";
import CommentForm from "../CommentForm/commentform";
import "./bloglist.css";

const BlogList = ({ blogs, userToken, onCommentSubmit }) => {
  return (
    <div className="blog-list">
      <h2>Blog List</h2>
      <ul>
        {blogs.map((blog) => (
          <BlogItem
            key={blog.id}
            blog={blog}
            userToken={userToken}
            onCommentSubmit={onCommentSubmit}
          />
        ))}
      </ul>
    </div>
  );
};

const BlogItem = ({ blog, userToken, onCommentSubmit }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5001/comments/${blog.id}`);
      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData); // Assuming commentsData is an array of comment objects
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blog.id]);

  const handleCommentSubmit = async (commentContent) => {
    try {
      const response = await fetch(`http://localhost:5001/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ blogId: blog.id, content: commentContent }),
      });

      if (response.ok) {
        fetchComments(); // Fetch updated comments
        onCommentSubmit(commentContent); // Pass commentContent to parent component
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  

  return (
    <li className="blog-item">
      <h3 className="blog-title">{blog.title}</h3>
      <p className="blog-content">{blog.content}</p>
      <CommentForm
        blogId={blog.id}
        userToken={userToken}
        onCommentSubmit={handleCommentSubmit}
      />
      <div className="comment-section">
          <h4>Comments:</h4>
          {comments.map((comment) => (
            <div className="comment" key={comment.id}>
              {comment.content}
            </div>
          ))}

      </div>

    </li>
  );
};

export default BlogList;
