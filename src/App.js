import React, { useState, useEffect } from 'react';
import './App.css';
import Timer from './Timer.jsx';

const App = () => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  const addComment = (content, timestamp) => {
    const newComment = {
      content,
      timestamp,
    };
    setComments((prevComments) => [...prevComments, newComment]);
  };

  useEffect(() => {
    scrollToLatestComment();
  }, [comments]);

  const scrollToLatestComment = () => {
    const commentList = document.getElementById('comment-list');
    commentList.scrollTop = commentList.scrollHeight;
  };

  const formatTimestamp = (timestamp) => {
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();
    if (commentInput.trim() !== '') {
      const newComment = {
        content: commentInput,
        timestamp: formatTimestamp(new Date()),
      };
      addComment(newComment.content, newComment.timestamp);
      setCommentInput('');
    }
  };

  const handleShowModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
  };

  const handleHideModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  };

// speakersを表示するための処理
const displaySpeakers = (speakers) => {
  // ランダムにソートする
  const shuffledSpeakers = speakers.sort(() => Math.random() - 0.5);

  const speakerList = document.getElementById('speaker-list');
  speakerList.innerText = ''; // 登壇者リストをクリア

  shuffledSpeakers.forEach((speaker) => {
    const listItem = document.createElement('li');
    listItem.textContent = speaker;
    speakerList.appendChild(listItem);
  });
};

// モーダルの送信ボタンクリック時の処理
const fetchSpeakers = async (eventUrl, status) => {
  const response = await fetch(`http://localhost:3001/api/speaker?eventUrl=${eventUrl}&status=${status}`);
  if (response.ok) {
    const speakers = await response.json();
    return speakers;
  } else {
    throw new Error('Failed to fetch speakers');
  }
};

const handleModalSubmit = async () => {
  const urlInput = document.getElementById('url-input').value;
  const statusInput = document.getElementById('status-input').value;

  if (urlInput && statusInput) {
    try {
      const speakers = await fetchSpeakers(urlInput, statusInput);
      console.log(speakers); // speakers を確認する
      handleHideModal();
      displaySpeakers(speakers); // speakers を表示する

      // speakersを表示するための処理を記述する
    } catch (error) {
      // エラーレスポンスやネットワークエラーなどの処理を行う
      console.error('Error:', error);
    }
  }
};

  

  return (
    <>
      <meta charSet="utf-8" />
      <title>LT Support Tool</title>
      <div id="app-title">LT Support Tool</div>
      <div id="container">
        <div id="speaker-section">
          <div id="subtitle">登壇者</div>
          <ol id="speaker-list" />
          <button id="speaker-get" onClick={handleShowModal}>
            登壇者リストを作成
          </button>
        </div>
        <div id="right-panel">
          <div id="timer-section">
            <div id="subtitle">タイマー</div>
            <Timer />
          </div>
          <div id="comment-section">
            <div id="subtitle">コメント欄</div>
            <ul id="comment-list">
              {comments.map((comment, index) => (
                <li key={index}>
                  {`${comment.content}\t${comment.timestamp}`}
                </li>
              ))}
            </ul>
            <form id="comment-form" onSubmit={handleSubmitComment}>
              <input
                type="textarea"
                id="comment-input"
                placeholder="コメントを入力してください"
                required=""
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button type="submit" id="comment-submit">
                送信
              </button>
            </form>
          </div>
        </div>
      </div>
      <div id="modal" className="modal">
        <div className="modal-content">
          <h2>URLと登壇者ステータス</h2>
          <input
            type="text"
            id="url-input"
            className="modal-input"
            placeholder="connpass上に登録のイベントのURLを入力してください"
          />
          <input
            type="text"
            id="status-input"
            className="modal-input"
            placeholder="登壇者のステータスを入力してください"
          />
          <button id="modal-submit" className="modal-button" onClick={handleModalSubmit}>
            開始
          </button>
          <button id="modal-cancel" onClick={handleHideModal}>
            キャンセル
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
