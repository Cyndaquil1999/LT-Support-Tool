import React, { useState, useRef, useEffect } from 'react';
import './timer_style.css';

function Timer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
          stopTimer();
        } else {
          if (seconds === 0) {
            setMinutes(prevMinutes => prevMinutes - 1);
            setSeconds(59);
          } else {
            setSeconds(prevSeconds => prevSeconds - 1);
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, minutes, seconds]);

  const plus_1s = () => {
    if (seconds >= 59) {
      setMinutes(prevMinutes => prevMinutes + 1);
      setSeconds(-1);
    }
    setSeconds(prevSeconds => prevSeconds + 1);
  };

  const plus_10s = () => {
    if (seconds >= 50) {
      setMinutes(prevMinutes => prevMinutes + 1);
      setSeconds(prevSeconds => prevSeconds - 60);
    }
    setSeconds(prevSeconds => prevSeconds + 10);
  };

  const plus_1m = () => {
    setMinutes(prevMinutes => prevMinutes + 1);
  };

  const plus_10m = () => {
    setMinutes(prevMinutes => prevMinutes + 10);
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
    <div className='container'>
      <div className='clock'>
        <div className='display'>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className='buttons'>
          <div>
            <button className='clock add-time' onClick={plus_10m}>+10m</button>
            <button className='clock add-time' onClick={plus_1m}>+1m</button>
            <button className='clock add-time' onClick={plus_10s}>+10s</button>
            <button className='clock add-time' onClick={plus_1s}>+1s</button>
          </div>
          <button className='clock set' onClick={startTimer} disabled={isRunning}>
            Start
          </button>
          <button className='clock set' onClick={stopTimer} disabled={!isRunning}>
            Stop
          </button>
          <button className='clock set' onClick={resetTimer}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default Timer;