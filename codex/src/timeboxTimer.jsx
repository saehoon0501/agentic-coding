import React, { useState, useRef, useEffect } from 'react';
import { Pause, PlayArrow, RestartAlt, Timer } from '@mui/icons-material';

function TimeboxTimer() {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration * 60);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTask('');
    setDuration(45);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      style={{
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        border: '1.5px solid #e5e7eb',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        minWidth: 370,
        maxWidth: 400,
        width: 370,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '1.5rem',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 2 }}>
          <Timer sx={{ fontSize: 28 }} />
          <span style={{ fontSize: 28, fontWeight: 700 }}>Timebox Timer</span>
        </div>
        <div className="dark:text-gray-400" style={{ color: '#6b7280', fontSize: 16, marginTop: 2 }}>Focus on one task at a time</div>
      </div>
      
      <div>
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>Task Name</label>
        <input
          type="text"
          placeholder="Record podcast"
          value={task}
          onChange={e => setTask(e.target.value)}
          style={{
            width: '100%',
            marginTop: 0,
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 15,
            outline: 'none',
            marginBottom: 18,
            background: isRunning ? '#f3f4f6' : '#f9fafb',
            color: isRunning ? '#9ca3af' : '#111827',
            cursor: isRunning ? 'not-allowed' : 'text',
          }}
          disabled={isRunning}
        />
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>Duration (minutes)</label>
        <input
          type="number"
          min={1}
          placeholder="45"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          style={{
            width: '100%',
            marginTop: 0,
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 15,
            outline: 'none',
            marginBottom: 18,
            background: isRunning ? '#f3f4f6' : '#f9fafb',
            color: isRunning ? '#9ca3af' : '#111827',
            cursor: isRunning ? 'not-allowed' : 'text',
          }}
          disabled={isRunning}
        />
        {!isRunning && (
          <button
            className="dark:bg-gray-700"
            style={{
              width: '100%',
              background: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontSize: 17,
              fontWeight: 600,
              cursor: !task || duration < 1 ? 'not-allowed' : 'pointer',
              marginTop: 4,
              opacity: !task || duration < 1 ? 0.7 : 1,
            }}
            onClick={handleStart}
            disabled={!task || duration < 1}
          >
            <PlayArrow sx={{ fontSize: 20, verticalAlign: 'middle', mr: 0.5 }} /> Start Timer
          </button>
        )}
      </div>

      {isRunning && (
        <div style={{
          background: '#f3f4f6',
          borderRadius: 12,
          padding: '1.5rem 0.5rem',
          marginBottom: 18,
          textAlign: 'center',
          border: '1px solid #e5e7eb',
        }}>
        <div className="dark:text-gray-400" style={{ color: '#6b7280', fontSize: 17, marginBottom: 2 }}>
          Current Task: <span style={{ fontWeight: 600, color: '#111827' }}>{task}</span>
        </div>
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: 1, margin: '8px 0' }}>{formatTime(timeLeft)}</div>
          <div className="dark:text-gray-400" style={{ color: '#6b7280', fontSize: 15 }}>Time remaining</div>
        </div>
      )}

      {isRunning && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            style={{
              flex: 1,
              background: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontSize: 17,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={handlePause}
          >
            <Pause sx={{ fontSize: 20, verticalAlign: 'middle', mr: 0.5 }} /> Pause
          </button>
          <button
            style={{
              flex: 1,
              background: '#9ca3af',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontSize: 17,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={handleReset}
          >
            <RestartAlt sx={{ fontSize: 20, verticalAlign: 'middle', mr: 0.5 }} /> Reset
          </button>
        </div>
      )}

      <div className="dark:text-gray-400" style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, marginTop: isRunning ? 8 : 0, minHeight: 24 }}>
        {isRunning ? 'Stay focused on your current task!' : ''}
      </div>
    </div>
  );
}

export default TimeboxTimer; 