import React, { useState, useRef, useEffect } from 'react';

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
    <div>
      <h1>Timer: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</h1>
      <div>
        <label>Minutes:</label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
          disabled={isRunning}
        />
      </div>
      <div>
        <label>Seconds:</label>
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(parseInt(e.target.value, 10))}
          disabled={isRunning}
        />
      </div>
      <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Timer;
