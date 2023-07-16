// CommentForm.js

import React, { useState } from 'react';

const CommentForm = ({ addComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (comment.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString();
      addComment(comment, timestamp);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="コメントを入力してください"
        required
      />
      <button type="submit">送信</button>
    </form>
  );
};

export default CommentForm;
