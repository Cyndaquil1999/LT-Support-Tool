// Modal.js

import React, { useState } from 'react';

const Modal = ({ modalSubmit, hideModal }) => {
  const [urlInput, setUrlInput] = useState('');
  const [statusInput, setStatusInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    modalSubmit(urlInput, statusInput);
    setUrlInput('');
    setStatusInput('');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>URLと登壇者ステータス</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="イベントのURLを入力してください"
          />
          <input
            type="text"
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
            placeholder="登壇者のステータスを入力してください"
          />
          <button type="submit">開始</button>
        </form>
        <button onClick={hideModal}>キャンセル</button>
      </div>
    </div>
  );
};

export default Modal;
