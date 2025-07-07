import React, { useState, useRef, useEffect } from 'react';

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
    setTimeLeft(duration * 60);
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Calculate progress for circular progress bar
  const totalSeconds = duration * 60;
  const progress = isRunning ? (timeLeft / totalSeconds) * 100 : 100;
  
  // SVG circle properties
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const CircularProgress = () => (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      margin: '0 auto',
    }}>
      <svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'rotate(-90deg)',
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progress > 20 ? "#3b82f6" : "#ef4444"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease-in-out',
          }}
        />
      </svg>
      {/* Timer content in center */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        width: '140px',
      }}>
        <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
          {task}
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 1 }}>
          {formatTime(timeLeft)}
        </div>
        <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
          remaining
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
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
    }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 28 }}>⏱</span>
          <span style={{ fontSize: 28, fontWeight: 700 }}>Timebox Timer</span>
        </div>
        <div style={{ color: '#6b7280', fontSize: 16, marginTop: 2 }}>Focus on one task at a time</div>
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
            ▶ Start Timer
          </button>
        )}
      </div>

      {isRunning && (
        <div style={{
          background: '#f8fafc',
          borderRadius: 12,
          padding: '2rem 1rem',
          marginBottom: 18,
          textAlign: 'center',
          border: '1px solid #e5e7eb',
        }}>
          <CircularProgress />
        </div>
      )}

      {isRunning && (
        <button
          style={{
            width: '100%',
            background: '#9ca3af',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontSize: 17,
            fontWeight: 600,
            cursor: 'not-allowed',
            marginTop: 4,
          }}
          disabled
        >
          ⏰ Timer Running...
        </button>
      )}

      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, marginTop: isRunning ? 8 : 0, minHeight: 24 }}>
        {isRunning ? 'Stay focused on your current task!' : ''}
      </div>
    </div>
  );
}

export default TimeboxTimer; 