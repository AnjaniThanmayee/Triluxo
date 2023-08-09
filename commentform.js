// src/components/CommentForm.js
import React, { useState } from "react";
import './commentform.css'

const CommentForm = ({ blogId, userToken, onCommentSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:5001/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ content: comment }), // Remove blogId from here
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Comment submission failed.");
      }
  
      setComment(""); // Clear the comment input field
      onCommentSubmit(comment);
    } catch (error) {
      console.error(error.message);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <textarea
          className="comment-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          required
        />
      </div>
      <button className="comment-submit" type="submit">Submit Comment</button>
    </form>
  );
};

export default CommentForm;
