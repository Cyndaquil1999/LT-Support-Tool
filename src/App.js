// App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './style/App.css';

import alarm1Sound from './music/001_zundamon_last1minute.wav';
import alarm2Sound from './music/001_zundamon_timeup.wav';

const Timer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  
  const playAlarmSound = useCallback((index) => {
    const audio = new Audio(getAlarmSound(index));
    audio.play();
  }, []);

  const getAlarmSound = useCallback((index) => {
    const alarmSounds = [alarm1Sound, alarm2Sound];
    return alarmSounds[index];
  }, []);
  

  useEffect(() => {
    const handleTimerTick = () => {
      if (minutes === 0 && seconds === 0) {
        playAlarmSound(1);
        stopTimer();
      } else {
        if (minutes === 1 && seconds === 0) {
          playAlarmSound(0);
        }
        if (seconds === 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }
    };

    if (isRunning) {
      intervalRef.current = setInterval(handleTimerTick, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, minutes, seconds, playAlarmSound]);

  const plus_1s = () => {
    if (seconds >= 59) {
      setMinutes((prevMinutes) => prevMinutes + 1);
      setSeconds(-1);
    }
    setSeconds((prevSeconds) => prevSeconds + 1);
  };

  const plus_10s = () => {
    if (seconds >= 50) {
      setMinutes((prevMinutes) => prevMinutes + 1);
      setSeconds((prevSeconds) => prevSeconds - 60);
    }
    setSeconds((prevSeconds) => prevSeconds + 10);
  };

  const plus_1m = () => {
    setMinutes((prevMinutes) => prevMinutes + 1);
  };

  const plus_10m = () => {
    setMinutes((prevMinutes) => prevMinutes + 10);
  };

  const startTimer = () => {
    if (!isRunning && (minutes > 0 || seconds > 0)) {
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setMinutes(0);
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className="timer-container">
      <h2 className="timer-title">タイマー</h2>
      <div className="clock">
        <div className="display">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className="buttons">
          <div>
            <button className="clock add-time" onClick={plus_10m}>
              +10m
            </button>
            <button className="clock add-time" onClick={plus_1m}>
              +1m
            </button>
            <button className="clock add-time" onClick={plus_10s}>
              +10s
            </button>
            <button className="clock add-time" onClick={plus_1s}>
              +1s
            </button>
          </div>
          <button className="clock set" onClick={startTimer} disabled={isRunning}>
            Start
          </button>
          <button className="clock set" onClick={stopTimer} disabled={!isRunning}>
            Stop
          </button>
          <button className="clock set" onClick={resetTimer}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [speakers, setSpeakers] = useState([]);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [statusInput, setStatusInput] = useState('');

  const addComment = (content, timestamp) => {
    const newComment = {
      content,
      timestamp,
    };
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const handleModalOutsideClick = (event) => {
    if (event.target.classList.contains('modal')) {
      setShowModal(false);
    }
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

  const handleModalSubmit = async () => {
    if (urlInput && statusInput) {
      try {
        const speakers = await fetchSpeakers(urlInput, statusInput);
        setShowModal(false);
        setSpeakers(shuffleArray(speakers));
        setCurrentSpeakerIndex(0);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const fetchSpeakers = async (eventUrl, status) => {
    const response = await fetch(`http://localhost:3001/api/speaker?eventUrl=${eventUrl}&status=${status}`);
    if (response.ok) {
      const speakers = await response.json();
      return speakers;
    } else {
      throw new Error('Failed to fetch speakers');
    }
  };

  const handlePrevSpeaker = () => {
    if (speakers.length > 0) {
      setCurrentSpeakerIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextSpeaker = () => {
    if (speakers.length > 0) {
      setCurrentSpeakerIndex((prevIndex) => prevIndex + 1);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="app">
      <h1 className="app-title">LT Host Assistant</h1>
      <div className="container">
        <div className="right-panel">
          <div className="speaker-section">
            <h2 className="subtitle">登壇者</h2>
            <div className="speaker-list">
              <ol>
                {speakers.map((speaker, index) => (
                  <li
                    key={index}
                    id={index === currentSpeakerIndex ? 'current-speaker' : 'speaker'}
                    onClick={() => setCurrentSpeakerIndex(index)}
                  >
                    {speaker}
                  </li>
                ))}
              </ol>
            </div>
            <div className="speaker-buttons">
              <button
                className="speaker-button"
                onClick={handlePrevSpeaker}
                disabled={currentSpeakerIndex === 0}
              >
                戻る
              </button>
              <button
                className="speaker-button"
                onClick={handleNextSpeaker}
                disabled={currentSpeakerIndex === speakers.length - 1}
              >
                進む
              </button>
            </div>
            <button className="speaker-get" onClick={() => setShowModal(true)}>
              登壇者リストを作成
            </button>
          </div>
        </div>
        <div className="left-panel">
          <div className="timer-section">
            <Timer />
          </div>
          <div className="comment-section">
            <h2 className="subtitle">コメント欄</h2>
            <ul className="comment-list" id="comment-list">
              {comments.map((comment, index) => (
                <li key={index}>
                  {`${comment.content}\t${comment.timestamp}`}
                </li>
              ))}
            </ul>
            <form className="comment-form" onSubmit={handleSubmitComment}>
              <textarea
                className="comment-input"
                placeholder="コメントを入力してください"
                required=""
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button type="submit" className="comment-submit">
                送信
              </button>
            </form>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal"
             onClick={handleModalOutsideClick}>
          <div className="modal-content">
            <h2>URLと登壇者ステータス</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="イベントのURLを入力してください"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <input
              type="text"
              className="modal-input"
              placeholder="登壇者のステータスを入力してください"
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
            />
            <button className="modal-button" onClick={handleModalSubmit}>
              開始
            </button>
            <button className="modal-cancel" onClick={() => setShowModal(false)}>
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
