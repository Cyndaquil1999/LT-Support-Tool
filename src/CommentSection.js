// CommentSection.js

import React, { useState } from 'react';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  const addComment = () => {
    if (commentInput.trim() !== '') {
      const newComment = {
        content: commentInput,
        timestamp: formatTimestamp(new Date()),
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setCommentInput('');
      scrollToLatestComment();
    }
  };

  const formatTimestamp = (timestamp) => {
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const scrollToLatestComment = () => {
    // 一番下にスクロールする処理
  };

  return (
    <div>
      <h2>コメント欄</h2>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            {comment.content} {comment.timestamp}
          </li>
        ))}
      </ul>
      <form onSubmit={addComment}>
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="コメントを入力してください"
          required
        />
        <button type="submit">送信</button>
      </form>
    </div>
  );
};

export default CommentSection;
